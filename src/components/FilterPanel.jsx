import { Divider, Button, Typography, Select } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { ALL_PITCH_TYPES, pitchTypeColor, pitchTypeLabel } from '../utils/pitchTypes'

const { Text } = Typography


const PITCHER_LABEL_OPTIONS = [
  { value: 'Power', label: 'Power' },
  { value: 'Finesse', label: 'Finesse' },
  { value: 'Sinker', label: 'Sinker' }
]

// ✨ 預先準備好 Statcast 時代 (2015起) 到未來的年份，全部使用字串確保與 game_date 匹配
const YEAR_OPTIONS = [
  '2025', '2024', '2023'
]

const COUNT_ROWS = [
  [{ b: 0, s: 0 }, { b: 0, s: 1 }, { b: 0, s: 2 }],
  [{ b: 1, s: 0 }, { b: 1, s: 1 }, { b: 1, s: 2 }],
  [{ b: 2, s: 0 }, { b: 2, s: 1 }, { b: 2, s: 2 }],
  [{ b: 3, s: 0 }, { b: 3, s: 1 }, { b: 3, s: 2 }],
]

function SectionLabel({ children }) {
  return (
    <Text style={{
      display: 'block', fontSize: 13, fontWeight: 700, color: '#c1ccda',
      textTransform: 'uppercase', marginBottom: 9,
    }}>
      {children}
    </Text>
  )
}

function Pill({ label, selected, onClick, color }) {
  const c = color || '#f0883e'
  return (
    <div
      onClick={onClick}
      style={{
        padding: '7px 12px', borderRadius: 6,
        border: `1px solid ${selected ? c : '#465b78'}`,
        background: selected ? `${c}25` : 'transparent',
        color: selected ? c : '#d3dce8',
        cursor: 'pointer', fontSize: 14, fontWeight: selected ? 700 : 500,
        userSelect: 'none', transition: 'all 0.15s',
      }}
    >
      {label}
    </div>
  )
}

// 用於處理「複選」的陣列按鈕
function TogglePills({ options, value, onChange, color }) {
  const toggle = (v) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v))
    else onChange([...value, v])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(opt => (
        <Pill
          key={opt.value}
          label={opt.label}
          selected={value.includes(opt.value)}
          onClick={() => toggle(opt.value)}
          color={color}
        />
      ))}
    </div>
  )
}

// 用於處理「單選」的字串按鈕 (專門給左右投、先發後援使用)
function SingleTogglePills({ options, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(opt => (
        <Pill
          key={opt.value}
          label={opt.label}
          selected={value === opt.value} // 變成直接比對字串
          onClick={() => onChange(opt.value)} // 直接回傳點選的字串
          color={color}
        />
      ))}
    </div>
  )
}

function CountGrid({ selectedCounts, onChange }) {
  const toggle = (key) => {
    if (selectedCounts.includes(key)) onChange(selectedCounts.filter(c => c !== key))
    else onChange([...selectedCounts, key])
  }
  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 3, paddingLeft: 26 }}>
        {['0S', '1S', '2S'].map(s => (
          <div key={s} style={{
            width: 38, textAlign: 'center', fontSize: 12,
            color: '#c1ccda',
          }}>{s}</div>
        ))}
      </div>
      {COUNT_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
          <div style={{
            width: 24, fontSize: 12, color: '#c1ccda',
            textAlign: 'right', marginRight: 4,
          }}>{ri}B</div>
          {row.map(({ b, s }) => {
            const key = `${b}-${s}`
            const sel = selectedCounts.includes(key)
            return (
              <div
                key={key}
                onClick={() => toggle(key)}
                style={{
                  width: 36, height: 28, marginRight: 3, borderRadius: 5,
                  border: `1px solid ${sel ? '#f0883e' : '#465b78'}`,
                  background: sel ? 'rgba(240,136,62,0.2)' : '#1c2b42',
                  color: sel ? '#f0883e' : '#c1ccda',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 13, fontWeight: sel ? 700 : 500,
                  userSelect: 'none', transition: 'all 0.12s',
                }}
              >
                {b}-{s}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function BaseSquare({ active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 18,
        height: 18,
        transform: 'rotate(45deg)',
        border: `2px solid ${active ? '#f0883e' : '#465b78'}`,
        background: active ? 'rgba(240,136,62,0.35)' : '#1c2b42',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    />
  )
}

function BaseDiamond({ bases = {}, onChange }) {
  const toggle = (base) => onChange({ ...bases, [base]: !bases[base] })

  return (
    <div style={{ position: 'relative', width: 104, height: 92 }}>
      <div style={{ position: 'absolute', left: 42, top: 4 }}>
        <BaseSquare active={Boolean(bases.second)} onClick={() => toggle('second')} />
      </div>
      <div style={{ position: 'absolute', left: 8, top: 38 }}>
        <BaseSquare active={Boolean(bases.third)} onClick={() => toggle('third')} />
      </div>
      <div style={{ position: 'absolute', left: 76, top: 38 }}>
        <BaseSquare active={Boolean(bases.first)} onClick={() => toggle('first')} />
      </div>
      <div style={{
        position: 'absolute',
        left: 42,
        top: 72,
        width: 18,
        height: 18,
        transform: 'rotate(45deg)',
        border: '2px solid #465b78',
        background: '#1c2b42',
      }} />
      <span style={{ position: 'absolute', left: 40, top: -14, fontSize: 12, color: '#c1ccda', fontWeight: 700 }}>2B</span>
      <span style={{ position: 'absolute', left: -12, top: 42, fontSize: 12, color: '#c1ccda', fontWeight: 700 }}>3B</span>
      <span style={{ position: 'absolute', left: 98, top: 42, fontSize: 12, color: '#c1ccda', fontWeight: 700 }}>1B</span>
    </div>
  )
}

function ZoneSelector({ selectedZones, onChange }) {
  const toggle = (zone) => {
    if (selectedZones.includes(zone)) onChange(selectedZones.filter(z => z !== zone))
    else onChange([...selectedZones, zone])
  }

  const CELL = 36
  const SIZE = CELL * 5
  const SS = CELL         // STRIKE_START
  const SE = SS + CELL * 3  // STRIKE_END
  const MID = SIZE / 2

  const sel = (zone) => selectedZones.includes(zone)
  const fillColor = (zone) => sel(zone) ? 'rgba(240,136,62,0.35)' : '#1c2b42'
  const textColor = (zone) => sel(zone) ? '#f0883e' : '#7a8a9e'
  const pathD = (pts) => pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z'

  const outerZones = [
    {
      zone: 11,
      path: [[0, 0], [MID, 0], [MID, SS], [SS, SS], [SS, MID], [0, MID]],
      tx: 8, ty: 13,
    },
    {
      zone: 12,
      path: [[MID, 0], [SIZE, 0], [SIZE, MID], [SE, MID], [SE, SS], [MID, SS]],
      tx: SIZE - 20, ty: 13,
    },
    {
      zone: 13,
      path: [[0, MID], [SS, MID], [SS, SE], [MID, SE], [MID, SIZE], [0, SIZE]],
      tx: 8, ty: SIZE - 5,
    },
    {
      zone: 14,
      path: [[SE, MID], [SIZE, MID], [SIZE, SIZE], [MID, SIZE], [MID, SE], [SE, SE]],
      tx: SIZE - 20, ty: SIZE - 5,
    },
  ]

  return (
    <svg width={SIZE} height={SIZE} style={{ display: 'block', cursor: 'default' }}>
      <rect width={SIZE} height={SIZE} fill="#0d1117" />

      {outerZones.map(({ zone, path, tx, ty }) => (
        <g key={zone} onClick={() => toggle(zone)} style={{ cursor: 'pointer' }}>
          <path d={pathD(path)} fill={fillColor(zone)} />
          <text x={tx} y={ty} fontSize={10} fontWeight="700" fill={textColor(zone)} fontFamily="monospace">
            {zone}
          </text>
        </g>
      ))}

      {[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ].flatMap((row, ri) =>
        row.map((zone, ci) => {
          const x = SS + ci * CELL
          const y = SS + ri * CELL
          return (
            <g key={zone} onClick={() => toggle(zone)} style={{ cursor: 'pointer' }}>
              <rect x={x} y={y} width={CELL} height={CELL} fill={fillColor(zone)} />
              <text x={x + CELL / 2} y={y + CELL / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={13} fontWeight="700"
                fill={textColor(zone)} fontFamily="monospace"
              >
                {zone}
              </text>
            </g>
          )
        })
      )}

      {/* outer border dividers */}
      <line x1={MID} y1={0} x2={MID} y2={SS} stroke="#30363d" strokeWidth={1} />
      <line x1={MID} y1={SE} x2={MID} y2={SIZE} stroke="#30363d" strokeWidth={1} />
      <line x1={0} y1={MID} x2={SS} y2={MID} stroke="#30363d" strokeWidth={1} />
      <line x1={SE} y1={MID} x2={SIZE} y2={MID} stroke="#30363d" strokeWidth={1} />

      {/* strike zone inner grid lines */}
      <line x1={SS + CELL} y1={SS} x2={SS + CELL} y2={SE} stroke="#21262d" strokeWidth={1} />
      <line x1={SS + CELL * 2} y1={SS} x2={SS + CELL * 2} y2={SE} stroke="#21262d" strokeWidth={1} />
      <line x1={SS} y1={SS + CELL} x2={SE} y2={SS + CELL} stroke="#21262d" strokeWidth={1} />
      <line x1={SS} y1={SS + CELL * 2} x2={SE} y2={SS + CELL * 2} stroke="#21262d" strokeWidth={1} />

      {/* strike zone border */}
      <rect x={SS} y={SS} width={CELL * 3} height={CELL * 3} fill="none" stroke="#465b78" strokeWidth={2} />
      {/* outer border */}
      <rect x={0} y={0} width={SIZE} height={SIZE} fill="none" stroke="#30363d" strokeWidth={2} />
    </svg>
  )
}

export default function FilterPanel({ filters, pitchers = [], loadingPitchers = false, onChange, onReset }) {
  const set = (key) => (val) => onChange(f => ({ ...f, [key]: val }))
  const setRunnerState = (runnerState) => onChange(f => ({ ...f, runnerState }))
  const setRunnerBases = (runnerBases) => onChange(f => ({ ...f, runnerState: 'Custom', runnerBases }))

  const uniquePitchers = Array.from(new Map(pitchers.map(p => [String(p.id), p])).values());

  const pitcherOptions = uniquePitchers.map(p => ({
    value: String(p.id),
    label: p.name,
  }))

  return (
    <div style={{ padding: '18px 16px', color: '#f3f7fb' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={{ color: '#c1ccda', fontSize: 14, textTransform: 'uppercase', fontWeight: 700 }}>
          Filters
        </Text>
        <Button
          size="small" type="text" icon={<ReloadOutlined />} onClick={onReset}
          style={{ color: '#c1ccda', fontSize: 13 }}
        >
          Reset
        </Button>
      </div>

      <SectionLabel>Season</SectionLabel>
      {/* 🚀 修正關鍵：原本這裡用 season，現在統一改成 year 才能跟 App.jsx 對接 */}
      <SingleTogglePills   
        options={[
          { value: '', label: 'ALL' },
          ...YEAR_OPTIONS.map(year => ({ value: year, label: year }))
        ]}
        value={filters.year}        
        onChange={set('year')}      
      />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitcher</SectionLabel>
      <Select
        mode="multiple"
        allowClear
        showSearch
        placeholder="Search by name..."
        value={filters.pitcherIds}
        onChange={(val) => onChange(f => ({ ...f, pitcherIds: val, ...(val.length > 0 ? { pitcherHands: '', pitcherLabels: [] } : {}) }))}
        options={pitcherOptions}
        loading={loadingPitchers}
        style={{ width: '100%', marginBottom: 8 }}
        maxTagCount={2}
        filterOption={(input, option) =>
          (option?.label || '').toLowerCase().includes(input.toLowerCase())
        }
      />
      <div style={{ opacity: filters.pitcherIds?.length > 0 ? 0.3 : 1, pointerEvents: filters.pitcherIds?.length > 0 ? 'none' : 'auto' }}>
        <div style={{ marginBottom: 4 }}>
          <Text style={{ fontSize: 13, color: '#c1ccda', textTransform: 'uppercase', fontWeight: 700 }}>
            or filter by label
          </Text>
        </div>
        <TogglePills
          options={PITCHER_LABEL_OPTIONS}
          value={filters.pitcherLabels}
          onChange={set('pitcherLabels')}
          color='#bc8cff'
        />
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Batter Hand</SectionLabel>
      <SingleTogglePills
        options={[
          { value: '', label: 'ALL' },
          { value: 'R', label: 'RHB' },
          { value: 'L', label: 'LHB' }
        ]}
        value={filters.batterHand}
        onChange={set('batterHand')}
      />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitcher Hand</SectionLabel>
      <div style={{ opacity: filters.pitcherIds?.length > 0 ? 0.3 : 1, pointerEvents: filters.pitcherIds?.length > 0 ? 'none' : 'auto' }}>
        <SingleTogglePills
          options={[
            { value: '', label: 'ALL' },
            { value: 'R', label: 'RHP' },
            { value: 'L', label: 'LHP' }
          ]}
          value={filters.pitcherHands}
          onChange={set('pitcherHands')}
        />
      </div>
      
      <div style={{ marginTop: 10 }}>
        <SectionLabel>Pitcher Role</SectionLabel>
        <SingleTogglePills
          options={[
            { value: 'All', label: 'ALL' },
            { value: 'SP', label: 'Starter' },
            { value: 'RP', label: 'Reliever' }
          ]}
          value={filters.pitcherRole}
          onChange={set('pitcherRole')}
        />
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Count</SectionLabel>
      <CountGrid selectedCounts={filters.counts} onChange={set('counts')} />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Outs</SectionLabel>
      <SingleTogglePills
        options={[
          { value: 'All', label: 'ALL' },
          { value: '0', label: '0 Out' },
          { value: '1', label: '1 Out' },
          { value: '2', label: '2 Outs' },
        ]}
        value={filters.outs}
        onChange={set('outs')}
      />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Runners On</SectionLabel>
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        <Pill label="ALL" selected={filters.runnerState === 'All'} onClick={() => setRunnerState('All')} />
        <Pill label="Empty" selected={filters.runnerState === 'Empty'} onClick={() => setRunnerState('Empty')} />
      </div>
      <div style={{
        paddingLeft: 20,
        marginTop: 14,
        marginBottom: 4,
        opacity: filters.runnerState === 'All' ? 0.45 : 1,
      }}>
        <BaseDiamond
          bases={filters.runnerBases}
          onChange={setRunnerBases}
        />
      </div>
      <Text style={{ display: 'block', fontSize: 13, color: '#c1ccda', marginTop: 6 }}>
        Select exact base occupancy
      </Text>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitch Type</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ALL_PITCH_TYPES.map(pt => {
          const sel = filters.pitchTypes.includes(pt)
          return (
            <div
              key={pt}
              onClick={() => {
                if (sel) set('pitchTypes')(filters.pitchTypes.filter(t => t !== pt))
                else set('pitchTypes')([...filters.pitchTypes, pt])
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 8px', borderRadius: 6,
                border: `1px solid ${sel ? pitchTypeColor(pt) : 'transparent'}`,
                background: sel ? `${pitchTypeColor(pt)}18` : 'transparent',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pitchTypeColor(pt), flexShrink: 0 }} />
              <Text style={{ fontSize: 14, color: sel ? '#f3f7fb' : '#d3dce8', fontWeight: sel ? 700 : 500 }}>
                <span style={{ fontWeight: 700, marginRight: 4 }}>{pt}</span>
                {pitchTypeLabel(pt)}
              </Text>
            </div>
          )
        })}
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Zone</SectionLabel>
      <ZoneSelector selectedZones={filters.zones} onChange={set('zones')} />
      <Text style={{ display: 'block', fontSize: 13, color: '#c1ccda', marginTop: 6 }}>
        Click to select zones
      </Text>
    </div>
  )
}
