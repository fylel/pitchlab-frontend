# PitchLab — 專案文件

## 使用方法

### 頁面導覽

PitchLab 分為三個主要功能頁面，從頂部 Navbar 切換：

| 頁面 | 說明 |
|------|------|
| **Features** | 功能介紹 |
| **Historical Data** | 歷史投球資料查詢與比較 |
| **Pitch Prediction** | 投球預測模型 |

---

### Historical Data — 歷史資料查詢

這是核心功能頁面，流程如下：

#### 1. 選擇球員
- 頂部 Header 的 **Batter** 下拉選單選擇打者
- 左側 Filter Panel 的 **Pitcher** 搜尋欄選擇一或多位投手

> 打者和投手至少選一個才會拉取資料。

#### 2. 套用篩選條件

左側 Filter Panel 由上到下依序：

| 篩選項目 | 說明 | 類型 |
|----------|------|------|
| **Season** | 賽季年份（2023 / 2024 / 2025 / ALL） | 單選 |
| **Pitcher** | 指定投手（可多選） | 搜尋多選 |
| **or filter by label** | 依投手風格篩選（Power / Finesse / Sinker），選了特定投手後此項停用 | 多選 |
| **Batter Hand** | 打者慣用手（RHB / LHB / ALL） | 單選 |
| **Pitcher Hand** | 投手慣用手（RHP / LHP / ALL），選了特定投手後此項停用 | 單選 |
| **Pitcher Role** | 先發 / 後援 / ALL | 單選 |
| **Count** | 當前球數（幾好幾壞），點選格子複選 | 複選格狀 |
| **Outs** | 出局數（0 / 1 / 2 / ALL） | 單選 |
| **Runners On** | 壘包狀況（ALL / Empty / 自訂壘包） | 單選 + 菱形圖 |
| **Pitch Type** | 球種篩選（FF / SL / CH...） | 複選列表 |
| **Zone** | 好球帶區域（1–9 內角；11–14 外角），點 SVG 格子複選 | 複選區域圖 |

右上角 **Reset** 按鈕可清除所有篩選條件。

#### 3. 多組比較（Set）

左側上方的 **Set Tabs** 支援最多 4 組同時比較：

- 點 **Compare +** 新增一組 Set
- 每組 Set 可獨立設定不同的篩選條件
- 多組時 Summary Stats 區會切換為對照表格顯示
- 點 Set Tab 上的 ✕ 刪除該組

#### 4. 查看結果

Content 區由上到下：

| 區塊 | 說明 |
|------|------|
| **Summary Stats** | Pitches / Strike% / Swing% / Whiff% / CSW% / BABIP%（滑鼠移到標題有說明） |
| **Zone Heatmap** | 好球帶各區域投球分布熱力圖 |
| **Result Chart** | 投球結果分布（多組時並列比較） |
| **Pitch Tracking Table** | 各球種詳細數據表（見下方欄位說明） |
| **Metric Perspective** | WPA 視角說明（從投手或打者哪一方觀察） |

---

### 資料顯示邏輯（投手 vs 打者）

| 選擇狀態 | 顯示資料 |
|----------|---------|
| 只選打者 | 該打者面對**所有投手**的所有投球資料 |
| 只選投手 | 該投手對**所有打者**的所有投球資料 |
| 同時選打者＋投手 | 兩人**直接對決**的投球資料（matchup 資料） |
| 都未選 | 不拉取資料，所有區塊空白 |

---

### Summary Stats 欄位說明

| 縮寫 | 全名 | 說明 |
|------|------|------|
| **Pitches** | Total Pitches | 投球總數 |
| **Strike%** | Strike Rate | 非壞球（好球、界外、打到球）佔比 |
| **Swing%** | Swing Rate | 打者揮棒率（含揮空、界外、打到球） |
| **Whiff%** | Whiff Rate | 揮棒落空 ÷ 揮棒總數（衡量投手讓打者揮空的能力） |
| **CSW%** | Called Strike + Whiff % | （好球帶稱好球 ＋ 揮空）÷ 投球總數，衡量投手主導好球帶的整體效率 |
| **BABIP%** | Batting Average on Balls In Play | 打到場內球的安打率（不含三振、全壘打） |

---

### Pitch Tracking Table 欄位說明

| 縮寫 | 全名 | 說明 |
|------|------|------|
| **#** | Count | 該球種投球總數 |
| **vs RHB** | vs Right-Handed Batter | 對右打者的投球數 |
| **vs LHB** | vs Left-Handed Batter | 對左打者的投球數 |
| **EMP xRUNS** | Expected Runs (batting team perspective) | 每球預期失分（以攻方視角，正值 = 攻方有利，負值 = 投手有利） |
| **WPA** | Win Probability Added | 每球勝率變化（視角依「只選投手」或「只選打者」而切換，見 Metric Perspective） |
| **%** | Usage Rate | 該球種使用率 |
| **MPH** | Miles Per Hour | 平均球速（英里/小時） |
| **PA** | Plate Appearances | 打席數（只計有打席結果的投球） |
| **AB** | At-Bats | 打數（排除保送、觸身球等） |
| **H** | Hits | 安打數 |
| **1B** | Singles | 一壘安打 |
| **2B** | Doubles | 二壘安打 |
| **3B** | Triples | 三壘安打 |
| **HR** | Home Runs | 全壘打 |
| **SO** | Strikeouts | 三振數 |
| **BBE** | Batted Ball Events | 打到場內球的次數（不含三振、保送） |
| **BA** | Batting Average | 打擊率（安打 ÷ 打數） |
| **SLG** | Slugging Percentage | 長打率（總壘數 ÷ 打數） |
| **wOBA** | Weighted On-Base Average | 加權上壘率（考慮每種結果的得分貢獻） |
| **Whiff%** | Whiff Percentage | 揮棒落空率（揮空 ÷ 揮棒） |
| **PutAway%** | Put Away Percentage | 兩好球後三振率（兩好球時的三振 ÷ 兩好球投球數） |

---

### 球種代碼說明

| 代碼 | 中文名稱 | 代碼 | 中文名稱 |
|------|---------|------|---------|
| **FF** | 四縫線速球 | **SL** | 滑球 |
| **SI** | 二縫線（Sinker） | **CH** | 變速球 |
| **FC** | 卡特球（Cutter） | **CU** | 曲球 |
| **ST** | 掃式滑球（Sweeper） | **FS** | 指叉球（Splitter） |
| **KC** | 指節曲球 | **SV** | Slurve（介於曲球和滑球） |
| **CS** | 慢速曲球 | **KN** | 指節球 |
| **FO** | 叉指球（Forkball） | **FA** | 速球（通用） |
| **EP** | Eephus（慢速吊球） | **SC** | 螺旋球 |

---

### 已知使用情境與限制

#### ⚠️ 投手與打者無對決資料時（已知 Bug）

當同時選了投手＋打者，但這兩人**從未在資料庫中對決過**（例如他們不在同聯盟、或資料年份沒有交集），後端回傳空結果，目前畫面行為：

- 所有圖表顯示空白
- Pitch Tracking Table 顯示 **"Select a pitcher or batter to view pitch tracking."**（這訊息會誤導使用者，以為自己沒有選人）
- Summary Stats 欄位消失
- **沒有任何提示說明「這兩人之間沒有對決紀錄」**

**根本原因：** [PitchTypeTable.jsx:187](src/components/PitchTypeTable.jsx#L187) 的空狀態訊息只判斷 `rows.length > 0`，未區分「完全未選人」與「有選人但無資料」這兩種不同狀況。

**建議修法：** 在 `PitchTypeTable`（以及其他區塊）接收 `filters` prop，判斷若有選人但無資料，顯示 "No data found for this pitcher-batter matchup." 而非目前的提示。

#### Count 篩選沒有資料時
若選了特定球數（如 3-2）但該組合在選定球員下資料量為零，目前畫面會直接呈現空圖表，**不會有提示訊息**。
- 建議：先不套用 Count 篩選確認基本資料存在，再縮小到特定球數。

#### 多重篩選疊加
篩選條件越多，命中筆數越少。建議操作順序：
1. 先選球員 → 確認有基本資料
2. 加 Season / Role / Hand → 確認資料量仍合理
3. 最後才加 Count / Zone 等細粒度篩選

#### API 狀態
右上角指示燈：
- 🟠 `API CONNECTING...` — 初始載入中
- 🟢 `LIVE BACKEND` — 後端連線正常

---

## 待補充

- UI/UX 優化規劃
- 已知 Bug 列表
- 部署流程
