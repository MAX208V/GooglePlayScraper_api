# GooglePlayScraper_api

基于 [google-play-scraper](https://www.npmjs.com/package/google-play-scraper) 的 Vercel Serverless API 服务，自动同步上游更新。

## 自动同步上游

通过 Dependabot 每周一自动检查 `google-play-scraper` 新版本，创建 PR 更新依赖。安装新版后，`/api/proxy` 自动支持新增方法，无需改代码。

## API 端点

### `/api/price`（向后兼容）

获取应用价格信息（原有接口）。

```
GET /api/price?id=com.flyersoft.moonreaderp&country=us&lang=en
```

### `/api/proxy`（统一入口）

通过 `method` 参数动态调用 npm 包的所有方法，参数直接透传。

```
GET /api/proxy?method=app&appId=com.flyersoft.moonreaderp
```

## 支持的方法

| 方法 | 说明 | 必填参数 |
|------|------|---------|
| `app` | 获取应用完整详情 | `appId` |
| `search` | 搜索应用 | `term` |
| `list` | 获取排行榜应用列表 | `collection` |
| `reviews` | 获取应用评论 | `appId` |
| `similar` | 获取类似应用 | `appId` |
| `developer` | 获取开发者所有应用 | `devId` |
| `suggest` | 搜索建议 | `term` |
| `permissions` | 获取应用权限 | `appId` |
| `datasafety` | 获取数据安全信息 | `appId` |
| `categories` | 获取所有分类 | (无) |

## 使用示例

```
# 获取应用详情
GET /api/proxy?method=app&appId=com.flyersoft.moonreaderp

# 搜索应用
GET /api/proxy?method=search&term=moon+reader&num=5

# 获取排行榜
GET /api/proxy?method=list&collection=TOP_FREE&num=3

# 获取评论
GET /api/proxy?method=reviews&appId=com.dxco.pandavszombies&sort=RATING&num=10

# 获取类似应用
GET /api/proxy?method=similar&appId=com.dxco.pandavszombies

# 开发者应用列表
GET /api/proxy?method=developer&devId=Google+LLC

# 权限信息
GET /api/proxy?method=permissions&appId=com.dxco.pandavszombies

# 数据安全
GET /api/proxy?method=datasafety&appId=com.dxco.pandavszombies

# 所有分类
GET /api/proxy?method=categories
```

## 可选参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `lang` | string | 语言代码，默认 `en` |
| `country` | string | 国家代码，默认 `us` |
| `throttle` | number | 每秒请求数限制 |

方法特有参数请参考 [google-play-scraper 文档](https://github.com/facundoolano/google-play-scraper)。
