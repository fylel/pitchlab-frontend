import { useState } from 'react'
import { Typography } from 'antd'

const { Text } = Typography

const CELL = 62
const GRID = 5
const SIZE = CELL * GRID
const RING = CELL
const STRIKE_START = RING
const STRIKE_SIZE = CELL * 3
const MID = SIZE / 2
const STRIKE_END = STRIKE_START + STRIKE_SIZE

const OUTER_CELLS = [
  {
    zone: 11,
    path: [[0,0],[MID,0],[MID,STRIKE_START],[STRIKE_START,STRIKE_START],[STRIKE_START,MID],[0,MID]],
    labelX: 10, labelY: 20, valueX: CELL * 0.75, valueY: CELL * 0.72,
  },
  {
    zone: 12,
    path: [[MID,0],[SIZE,0],[SIZE,MID],[STRIKE_END,MID],[STRIKE_END,STRIKE_START],[MID,STRIKE_START]],
    labelX: SIZE - 30, labelY: 20, valueX: SIZE - CELL * 0.75, valueY: CELL * 0.72,
  },
  {
    zone: 13,
    path: [[0,MID],[STRIKE_START,MID],[STRIKE_START,STRIKE_END],[MID,STRIKE_END],[MID,SIZE],[0,SIZE]],
    labelX: 12, labelY: SIZE - 12, valueX: CELL * 0.75, valueY: SIZE - CELL * 0.65,
  },
  {
    zone: 14,
    path: [[STRIKE_END,MID],[SIZE,MID],[SIZE,SIZE],[MID,SIZE],[MID,STRIKE_END],[STRIKE_END,STRIKE_END]],
    labelX: SIZE - 34, labelY: SIZE - 12, valueX: SIZE - CELL * 0.75, valueY: SIZE - CELL * 0.65,
  },
]

const ZONE_CELLS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
].flatMap((row, ri) =>
  row.map((zone, ci) => ({
    zone,
    x: STRIKE_START + ci * CELL,
    y: STRIKE_START + ri * CELL,
    width: CELL,
    height: CELL,
  }))
)

const PROB_COLOR = '88,166,255'

export default function NextPitchProbabilityHeatmap({ nextPitchData, setName, setColor }) {
  const [tooltip, setTooltip] = useState(null)

  const zones = nextPitchData?.zones || {}
  const selectedCount = nextPitchData?.selected_count ?? 0
  const validNextCount = nextPitchData?.valid_next_count ?? 0
  const excludedCount = selectedCount - validNextCount

  // Relative normalization: colour depth relative to hottest zone
  const maxProb = Math.max(...Object.values(zones).map(z => z.probability || 0), 0.001)

  const getCellBg = (zoneNum) => {
    const d = zones[String(zoneNum)]
    if (!d) return `rgba(${PROB_COLOR}, 0.05)`
    const v = d.probability / maxProb
    return `rgba(${PROB_COLOR}, ${(v * 0.85 + 0.05).toFixed(3)})`
  }

  const getCellTextColor = (zoneNum) => {
    const d = zones[String(zoneNum)]
    if (!d) return '#e6edf3'
    return (d.probability / maxProb) > 0.55 ? '#0d1117' : '#e6edf3'
  }

  const getDisplayText = (zoneNum) => {
    const d = zones[String(zoneNum)]
    if (!d || d.count === 0) return { main: '—', sub: '' }
    return { main: `${(d.probability * 100).toFixed(0)}%`, sub: `n=${d.count}` }
  }

  const pathD = (pts) =>
    `${pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')} Z`

  const showTooltip = (e, zoneNum) => {
    const d = zones[String(zoneNum)]
    if (d) setTooltip({ zone: zoneNum, data: d, x: e.clientX, y: e.clientY })
  }

  return (
    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {setName && setColor && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: setColor }} />
        )}
        <Text style={{
          color: '#e6edf3', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>
          Next Pitch Probability {setName ? `· ${setName}` : ''}
        </Text>
      </div>

      {/* Sample size summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, color: '#484f58', fontFamily: 'JetBrains Mono, monospace' }}>
          Selected: <span style={{ color: '#e6edf3' }}>{selectedCount}</span>
        </Text>
        <Text style={{ fontSize: 11, color: '#484f58', fontFamily: 'JetBrains Mono, monospace' }}>
          Next: <span style={{ color: '#58a6ff' }}>{validNextCount}</span>
        </Text>
        <Text style={{ fontSize: 11, color: '#484f58', fontFamily: 'JetBrains Mono, monospace' }}>
          Terminal: <span style={{ color: '#484f58' }}>{excludedCount}</span>
        </Text>
      </div>

      {/* SVG */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          width={SIZE} height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ borderRadius: 4, overflow: 'hidden' }}
        >
          <rect width={SIZE} height={SIZE} fill="#0d1117" />

          {OUTER_CELLS.map(({ zone, path, labelX, labelY, valueX, valueY }) => {
            const { main } = getDisplayText(zone)
            const textCol = getCellTextColor(zone)
            return (
              <g key={zone}
                onMouseMove={(e) => showTooltip(e, zone)}
                onMouseLeave={() => setTooltip(null)}
              >
                <path d={pathD(path)} fill={getCellBg(zone)} />
                <text x={labelX} y={labelY} textAnchor="start" fontSize={10}
                  fill={textCol} opacity={0.4} fontFamily="JetBrains Mono, monospace" fontWeight="700">
                  {zone}
                </text>
                <text x={valueX} y={valueY} textAnchor="middle" dominantBaseline="middle"
                  fontSize={13} fontWeight="800" fill={textCol} fontFamily="JetBrains Mono, monospace">
                  {main}
                </text>
              </g>
            )
          })}

          <line x1={MID} y1={0} x2={MID} y2={STRIKE_START} stroke="#30363d" strokeWidth={1.5} />
          <line x1={MID} y1={STRIKE_END} x2={MID} y2={SIZE} stroke="#30363d" strokeWidth={1.5} />
          <line x1={0} y1={MID} x2={STRIKE_START} y2={MID} stroke="#30363d" strokeWidth={1.5} />
          <line x1={STRIKE_END} y1={MID} x2={SIZE} y2={MID} stroke="#30363d" strokeWidth={1.5} />

          {ZONE_CELLS.map(({ zone, x, y, width: w, height: h }) => {
            const { main } = getDisplayText(zone)
            const textCol = getCellTextColor(zone)
            return (
              <g key={zone}
                onMouseMove={(e) => showTooltip(e, zone)}
                onMouseLeave={() => setTooltip(null)}
              >
                <rect x={x} y={y} width={w} height={h} fill={getCellBg(zone)} />
                <text x={x + 10} y={y + 16} textAnchor="start" fontSize={10}
                  fill={textCol} opacity={0.4} fontFamily="JetBrains Mono, monospace" fontWeight="700">
                  {zone}
                </text>
                <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle"
                  fontSize={22} fontWeight="800" fill={textCol} fontFamily="JetBrains Mono, monospace">
                  {main}
                </text>
              </g>
            )
          })}

          <rect x={STRIKE_START} y={STRIKE_START} width={STRIKE_SIZE} height={STRIKE_SIZE}
            fill="none" stroke="#30363d" strokeWidth={2} />
          <line x1={STRIKE_START + CELL} y1={STRIKE_START} x2={STRIKE_START + CELL} y2={STRIKE_END}
            stroke="#21262d" strokeWidth={1.5} />
          <line x1={STRIKE_START + CELL * 2} y1={STRIKE_START} x2={STRIKE_START + CELL * 2} y2={STRIKE_END}
            stroke="#21262d" strokeWidth={1.5} />
          <line x1={STRIKE_START} y1={STRIKE_START + CELL} x2={STRIKE_END} y2={STRIKE_START + CELL}
            stroke="#21262d" strokeWidth={1.5} />
          <line x1={STRIKE_START} y1={STRIKE_START + CELL * 2} x2={STRIKE_END} y2={STRIKE_START + CELL * 2}
            stroke="#21262d" strokeWidth={1.5} />
          <rect x={0} y={0} width={SIZE} height={SIZE} fill="none" stroke="#30363d" strokeWidth={2} />
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <Text style={{ fontSize: 10, color: '#484f58' }}>Low</Text>
        <div style={{
          width: 80, height: 6, borderRadius: 3,
          background: `linear-gradient(to right, rgba(${PROB_COLOR},0.05), rgba(${PROB_COLOR},0.9))`,
        }} />
        <Text style={{ fontSize: 10, color: '#484f58' }}>High</Text>
      </div>

      <Text style={{
        display: 'block', textAlign: 'center',
        fontSize: 10, color: '#30363d', marginTop: 5,
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        Historical sequence · not a prediction model
      </Text>

      {/* Tooltip */}
      {tooltip && (() => {
        const { zone, data, x, y } = tooltip
        const topTypes = Object.entries(data.pitch_type_breakdown || {}).slice(0, 4)
        const topResults = Object.entries(data.result_breakdown || {}).slice(0, 4)
        return (
          <div style={{
            position: 'fixed', left: x + 14, top: y - 20,
            background: '#1f2937', border: '1px solid #374151', borderRadius: 6,
            padding: '8px 12px', fontSize: 11, color: '#e6edf3',
            pointerEvents: 'none', zIndex: 9999,
            fontFamily: 'JetBrains Mono, monospace',
            whiteSpace: 'nowrap', lineHeight: 1.9,
          }}>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Zone {zone}</div>
            <div>Count: {data.count} &nbsp;·&nbsp; {(data.probability * 100).toFixed(1)}%</div>
            {data.most_common_pitch_type && (
              <div style={{ color: '#58a6ff' }}>Top pitch: {data.most_common_pitch_type}</div>
            )}
            {data.most_common_result && (
              <div style={{ color: '#3fb950' }}>Top result: {data.most_common_result}</div>
            )}
            {topTypes.length > 0 && (
              <div style={{ marginTop: 6, borderTop: '1px solid #374151', paddingTop: 6 }}>
                <div style={{ color: '#484f58', fontSize: 10, marginBottom: 2 }}>PITCH TYPES</div>
                {topTypes.map(([pt, cnt]) => (
                  <div key={pt}>{pt}: {cnt}</div>
                ))}
              </div>
            )}
            {topResults.length > 0 && (
              <div style={{ marginTop: 6, borderTop: '1px solid #374151', paddingTop: 6 }}>
                <div style={{ color: '#484f58', fontSize: 10, marginBottom: 2 }}>RESULTS</div>
                {topResults.map(([r, cnt]) => (
                  <div key={r}>{r}: {cnt}</div>
                ))}
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
