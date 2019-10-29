import { h, Component } from "preact"
import debounce from "debounce-fn"

import TopSites from "./top-sites"
import RecentBookmarks from "./recent-bookmarks"
import Collections from "./collections"
import QuerySuggestions from "./query-suggestions"
import BookmarkSearch from "./bookmark-search"
import History from "./history"
import ListBookmarksByTag from "./bookmark-tags"
import ListBookmarksByCollection from "./collection-list"
import ListSpeedDial from "./speed-dial"
import AutocompleteBookmarks from "./autocomplete-bookmarks"
import AutocompleteTopSites from "./autocomplete-top-sites"

import Sidebar from "./sidebar"
import Tagbar from "./tagbar"
import Messaging from "./messaging"
import URLIcon from "./url-icon"
import Icon from "./icon"

const MAX_ITEMS = 5

export default class Results extends Component {
  constructor(props) {
    super(props)
    this.messages = new Messaging()
    this._onKeyPress = debounce(this.onKeyPress.bind(this), 50)
    this._select = debounce(this.select.bind(this), 100)

    this.setCategories(props)
  }

  componentWillReceiveProps(props) {
    if (props.recentBookmarksFirst !== this.props.recentBookmarksFirst) {
      this.setCategories(props)
    }
  }

  setCategories(props) {
    const categories = [
      new ListSpeedDial(this, 0),
      new QuerySuggestions(this, 1),
      new AutocompleteTopSites(this, 2),
      new AutocompleteBookmarks(this, 3),
      new TopSites(this, props.recentBookmarksFirst ? 5 : 4),
      new RecentBookmarks(this, props.recentBookmarksFirst ? 4 : 5),
      new Collections(this, 6),
      new ListBookmarksByTag(this, 7),
      //new BookmarkSearch(this, 7),
      new History(this, 8),
      new ListBookmarksByCollection(this, 9)
    ]

    this.setState({
      categories
    })

    this.update(props.query || "")
  }

  addRows(category, rows) {
    if (rows.length === 0) return

    let tags = this.state.tags
    let i = rows.length
    while (i--) {
      if (rows[i].tags) {
        tags = tags.concat(rows[i].tags)
      }
    }

    tags = tags.filter(t => "tag:" + t !== this.props.query)

    const content = this.trim(
      this.state.content.concat(
        rows.map((row, i) => {
          return {
            row,
            index: this.state.content.length + i
          }
        })
      )
    )

    this.setState({
      content,
      tags
    })
  }

  count(filterFn) {
    return this.state.content.filter(filterFn).length
  }

  removeRows(filterFn) {
    this.setState({
      content: this.state.content.filter(filterFn)
    })
  }

  content() {
    let content = this.state.content
    content.sort((a, b) => {
      if (a.row.category.sort < b.row.category.sort) return -1
      if (a.row.category.sort > b.row.category.sort) return 1

      if (a.index < b.index) return -1
      if (a.index > b.index) return 1

      return 0
    })

    const dict = {}
    const uniques = content.filter(c => {
      if (dict[c.row.key()]) return false
      dict[c.row.key()] = true
      return true
    })

    return content.map((c, index) => {
      return {
        row: c.row,
        absIndex: index,
        index
      }
    })
  }

  contentByCategory() {
    if (this.state.content.length === 0) return []

    const content = this.content()

    const selectedCategory =
      this.state.selected && content[this.state.selected]
        ? content[this.state.selected].row.category
        : content[0].row.category
    const categories = []
    const categoriesMap = {}

    let tabIndex = 2
    let category = null
    content.forEach((c, ind) => {
      if (!category || category.name !== c.row.category.name) {
        category = c.row.category
        categoriesMap[category.name] = {
          title: category.title,
          name: category.name,
          sort: category.sort,
          collapsed:
            content.length >= MAX_ITEMS &&
            selectedCategory.name != category.name &&
            !!category.title,
          rows: []
        }

        categories.push(categoriesMap[category.name])

        c.tabIndex = ++tabIndex
      }

      categoriesMap[category.name].rows.push(c)
    })

    return categories
  }

  trim(content) {
    const categoryCounts = {}
    const pinnedCount = this.pinnedRowCount()

    content = content.filter(c => {
      if (!categoryCounts[c.row.category.name]) {
        categoryCounts[c.row.category.name] = 0
      }

      categoryCounts[c.row.category.name]++

      return (
        c.row.category.pinned ||
        MAX_ITEMS - pinnedCount >= categoryCounts[c.row.category.name]
      )
    })

    return content
  }

  pinnedRowCount(content) {
    content || (content = this.state.content)
    const len = content.length

    let ctr = 0
    let i = -1
    while (++i < len) {
      if (content[i].row.category.pinned) {
        ctr++
      }
    }

    return ctr
  }

  reset(query, callback) {
    this.setState(
      {
        selected: 0,
        content: [],
        tags: [],
        errors: [],
        query: query || ""
      },
      callback
    )
  }

  update(query) {
    query = (query || "").trim()
    this.reset(query)
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
      selected:
        this.state.selected == 0
          ? this.state.content.length - 1
          : this.state.selected - 1
    })
  }

  selectNextCategory() {
    let currentCategory = this.state.content[this.state.selected].row.category

    const len = this.state.content.length
    let i = this.state.selected
    while (++i < len) {
      if (this.state.content[i].row.category.sort !== currentCategory.sort) {
        this.select(i)
        return
      }
    }

    if (this.state.content[0].row.category.sort !== currentCategory.sort) {
      this.select(0)
    }
  }

  selectPreviousCategory() {
    let currentCategory = this.state.content[this.state.selected].row.category

    const len = this.state.content.length
    let i =
      this.state.selected === 0
        ? len - this.state.selected
        : this.state.selected

    let nextCategorySort = undefined
    let nextCategoryIndex = undefined

    while (i--) {
      if (
        nextCategorySort !== undefined &&
        nextCategorySort !== this.state.content[i].row.category.sort
      ) {
        this.select(nextCategoryIndex)
        return
      }

      if (this.state.content[i].row.category.sort !== currentCategory.sort) {
        nextCategoryIndex = i
        nextCategorySort = this.state.content[i].row.category.sort
        continue
      }
    }

    if (this.state.content[0].row.category.sort !== currentCategory.sort) {
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
    window.addEventListener("keyup", this._onKeyPress, false)
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this._onKeyPress, false)
  }

  componentWillReceiveProps(props) {
    if (props.query !== this.props.query) {
      this.update(props.query || "")
    }

    if (props.recentBookmarksFirst !== this.props.recentBookmarksFirst) {
      this.setCategories(props)
    }
  }

  onKeyPress(e) {
    if (e.keyCode == 13) {
      // enter
      this.state.content[this.state.selected].row.onPressEnter()
    } else if (e.keyCode == 9 || (e.keyCode === 40 && e.ctrlKey)) {
      // tab key or ctrl+down
      this.selectNextCategory()
      e.preventDefault()
      e.stopPropagation()
    } else if (e.keyCode === 38 && e.ctrlKey) {
      // ctrl+up
      this.selectPreviousCategory()
      e.preventDefault()
      e.stopPropagation()
    } else if (e.keyCode == 40) {
      // down arrow
      this.selectNext()
    } else if (e.keyCode == 38) {
      // up arrow
      this.selectPrevious()
    } else if (e.ctrlKey && e.keyCode == 37) {
      this.props.prevWallpaper()
      e.preventDefault()
      e.stopPropagation()
    } else if (e.ctrlKey && e.keyCode == 39) {
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
            {this.contentByCategory().map(category =>
              this.renderCategory(category)
            )}
          </div>
          <Sidebar
            onChange={() => this.update()}
            selected={
              this.content()[this.state.selected] &&
              this.content()[this.state.selected].row
            }
            messages={this.messages}
            onUpdateTopSites={() => this.onUpdateTopSites()}
            updateFn={() => this.update(this.props.query || "")}
          />
          <div className="clear" />
        </div>
        <Tagbar
          query={this.props.query}
          openTag={this.props.openTag}
          content={this.state.tags}
        />
      </div>
    )
  }

  renderCategory(c) {
    const overflow =
      c.collapsed &&
      this.state.content[this.state.selected].row.category.sort < c.sort &&
      this.counter < MAX_ITEMS
        ? c.rows.slice(0, MAX_ITEMS - this.counter)
        : []
    const collapsed = c.rows.slice(overflow.length, MAX_ITEMS)

    return (
      <div className={`category ${c.collapsed ? "collapsed" : ""}`}>
        {this.renderCategoryTitle(c)}
        {overflow.length > 0 ? (
          <div className="category-rows overflow">
            {overflow.map(c => this.renderRow(c.row, c.index))}
          </div>
        ) : null}
        {collapsed.length > 0 ? (
          <div className="category-rows">
            {collapsed.map(c => this.renderRow(c.row, c.index))}
          </div>
        ) : null}
      </div>
    )
  }

  renderCategoryTitle(c) {
    if (!c.title) return

    let title = c.title
    if (typeof title === "function") {
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

  renderRow(row, index) {
    this.counter++

    return (
      <URLIcon
        content={row}
        index={index}
        onSelect={index => this._select(index)}
        selected={this.state.selected == index}
      />
    )
  }
}
