import { h, Component } from "preact"
import debounce from "debounce-fn"

import TopSites from "./top-sites"
import RecentBookmarks from "./recent-bookmarks"
import QuerySuggestions from "./query-suggestions"
import BookmarkSearch from "./bookmark-search"
import History from "./history"
import BookmarkTags from "./bookmark-tags"

import Sidebar from "./sidebar"
import Tagbar from "./tagbar"
import Messaging from "./messaging"
import URLIcon from "./url-icon"
import Icon from "./icon"
import OpenWebsite from './open-website'

const MAX_ITEMS = 5

export default class Results extends Component {
  constructor(props) {
    super(props)
    this.messages = new Messaging()

    this.setCategories(props)

    this._onKeyPress = debounce(this.onKeyPress.bind(this), 50)
    this.update(props.query || "")
  }

  componentWillReceiveProps(props) {
    if (props.recentBookmarksFirst !== this.props.recentBookmarksFirst) {
      this.setCategories(props)
    }
  }

  setCategories(props) {
    const categories = [
      new OpenWebsite(this, 1),
      new QuerySuggestions(this, 2),
      new TopSites(this, props.recentBookmarksFirst ? 4 : 3),
      new RecentBookmarks(this, props.recentBookmarksFirst ? 3 : 4),
      new BookmarkTags(this, 5),
      new BookmarkSearch(this, 6),
      new History(this, 7)
    ]

    this.setState({
      categories
    })

    this.update(props.query || "")
  }

  addRows(category, rows) {
    if (rows.length === 0) return

    const urlMap = {}
    let i = this.state.content.length
    while (i--) {
      urlMap[this.state.content[i].url] = true
    }

    let tags = this.state.tags
    i = rows.length;
    while (i--) {
      if (rows[i].tags) {
        tags = tags.concat(rows[i].tags)
      }
    }

    tags = tags.filter(t => 'tag:' + t !== this.props.query)

    const content = this.trim(this.state.content.concat(rows.filter(r => !urlMap[r.url]).map((r, i) => {
      r.category = category
      r.index = this.state.content.length + i
      return r
    })))

    this.setState({
      content,
      tags
    })
  }

  content() {
    let content = this.state.content
    content.sort((a, b) => {
      if (a.category.sort < b.category.sort) return -1
      if (a.category.sort > b.category.sort) return 1

      if (a.index < b.index) return -1
      if (a.index > b.index) return 1

      return 0
    })

    return content.map((row, index) => {
      return {
        url: row.url,
        title: row.title,
        images: row.images,
        type: row.category.name,
        category: row.category,
        absIndex: index,
        index
      }
    })
  }

  contentByCategory() {
    if (this.state.content.length === 0) return []

    const content = this.content()
    const selectedCategory = this.state.selected ? content[this.state.selected].category : content[0].category
    const categories = []
    const categoriesMap = {}

    let tabIndex = 2
    let category = null
    content.forEach((row, ind) => {
      if (!category || category.name !== row.category.name) {
        category = row.category
        categoriesMap[category.name] = {
          title: category.title,
          name: category.name,
          sort: category.sort,
          collapsed: content.length >= MAX_ITEMS && selectedCategory.name != category.name && !!category.title,
          rows: []
        }

        categories.push(categoriesMap[category.name])

        row.tabIndex = ++tabIndex
      }

      categoriesMap[category.name].rows.push(row)
    })

    return categories
  }

  trim(content) {
    const categoryCounts = {}
    const pinnedCount = this.pinnedRowCount()

    content = content.filter(r => {
      if (!categoryCounts[r.category.name]) {
        categoryCounts[r.category.name] = 0
      }

      categoryCounts[r.category.name]++

      return r.category.pinned || MAX_ITEMS - pinnedCount >= categoryCounts[r.category.name]
    })

    return content
  }

  pinnedRowCount(content) {
    content || (content = this.state.content)
    const len = content.length

    let ctr = 0
    let i = -1
    while (++i < len) {
      if (content[i].category.pinned) {
        ctr++
      }
    }

    return ctr
  }

  reset(query) {
    this.setState({
      selected: 0,
      content: [],
      tags: [],
      errors: [],
      query: query || ''
    })
  }

  update(query) {
    query = (query || "").trim()
    this.reset()
    this.state.categories.forEach(c => c.onNewQuery(query))
  }

  select(index) {
    this.setState({
      selected: index
    })
  }

  selectNext() {
    this.setState({
      selected: (this.state.selected + 1) % this.state.content.length
    })
  }

  selectPrevious() {
    this.setState({
      selected: this.state.selected == 0 ? this.state.content.length - 1 : this.state.selected - 1
    })
  }

  selectNextCategory() {
    let currentCategory = this.state.content[this.state.selected].category

    const len = this.state.content.length
    let i = this.state.selected
    while (++i < len) {
      if (this.state.content[i].category.sort !== currentCategory.sort) {
        this.select(i)
        return
      }
    }

    if (this.state.content[0].category.sort !== currentCategory.sort) {
      this.select(0)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.query !== this.props.query) {
      return true
    }

    if (nextState.content.length !== this.state.content.length) {
      return true
    }

    if (nextState.selected !== this.state.selected) {
      return true
    }

    if (nextProps.recentBookmarksFirst !== this.props.recentBookmarksFirst) {
      return true
    }

    return false
  }

  componentWillMount() {
    window.addEventListener('keyup', this._onKeyPress, false)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this._onKeyPress, false)
  }

  componentWillReceiveProps(props) {
    if (props.query !== this.props.query) {
      this.update(props.query || "")
    }

    if (props.recentBookmarksFirst !== this.props.recentBookmarksFirst) {
      this.setCategories(props)
    }

  }

  navigateTo(url) {
    if (!/^\w+:\/\//.test(url)) {
      url = 'http://' + url
    }

    document.location.href = url
  }

  onKeyPress(e) {
    if (e.keyCode == 13) { // enter
      this.navigateTo(this.state.content[this.state.selected].url)
    } else if (e.keyCode == 40) { // down arrow
      this.selectNext()
    } else if (e.keyCode == 38) { // up arrow
      this.selectPrevious()
    } else if (e.keyCode == 9) { // tab key
      this.selectNextCategory()
      e.preventDefault()
      e.stopPropagation()
    } else if (e.ctrlKey && e.keyCode == 37) {
      this.props.prevWallpaper()
      e.preventDefault()
      e.stopPropagation()
    } else if(e.ctrlKey && e.keyCode == 39) {
      this.props.nextWallpaper()
      e.preventDefault()
      e.stopPropagation()
    }
  }

  render() {
    this.counter = 0

    return (
      <div className={`results ${this.state.tags.length ? "has-tags" : ""}`}>
        <div className="links">
          <div className="results-categories">
            {this.contentByCategory().map(category => this.renderCategory(category))}
          </div>
          <Sidebar onChange={() => this.update()} selected={this.content()[this.state.selected]} messages={this.messages} onUpdateTopSites={() => this.onUpdateTopSites()} updateFn={() => this.update(this.props.query || "")} />
          <div className="clear"></div>
        </div>
        <Tagbar query={this.props.query} openTag={this.props.openTag} content={this.state.tags} />
      </div>
    )
  }

  renderCategory(c) {
    const overflow = c.collapsed && this.state.content[this.state.selected].category.sort < c.sort && this.counter < MAX_ITEMS ? c.rows.slice(0, MAX_ITEMS - this.counter) : []
    const collapsed = c.rows.slice(overflow.length, MAX_ITEMS)

    return (
      <div className={`category ${c.collapsed ? "collapsed" : ""}`}>
        {this.renderCategoryTitle(c)}
        {overflow.length > 0 ? <div className='category-rows overflow'>
          {overflow.map((row) => this.renderRow(row))}
        </div> : null}
         {collapsed.length > 0 ? <div className='category-rows'>
            {collapsed.map((row) => this.renderRow(row))}
         </div> : null}
      </div>
    )
  }

  renderCategoryTitle(c) {
    if (!c.title) return

    let title = c.title
    if (typeof title === 'function') {
      title = c.title(this.props.query)
    }

    return (
      <div className="title">
        <h1 onClick={() => this.select(c.rows[0].absIndex)}>
          <Icon stroke="3" name="rightChevron" />
          {title}
        </h1>
      </div>
    )
  }

  renderRow(row) {
    this.counter++

    return (
      <URLIcon content={row} onSelect={r => this.select(r.index)} selected={this.state.selected == row.index} />
    )
  }
}
