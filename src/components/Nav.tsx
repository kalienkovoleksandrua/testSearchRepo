import { useEffect, useRef, useState } from 'react'
import SearchIcon from '../assets/search.svg'
import FilterIcon from '../assets/settings-2.svg'
import './Nav.css'

// Мокований масив продуктів для пошуку
const PRODUCTS = [
  'Bananas',
  'Bananas Peppers',
  'Bananas Dry',
  'Banana Chips',
  'Oranges',
  'Orange Juice',
  'Orange Marmalade',
  'Apples',
  'Apple Juice',
  'Apple Pie',
  'Grapes',
  'Grape Juice',
  'Strawberries',
  'Blueberries',
  'Watermelon',
  'Pineapple',
  'Mango',
  'Peaches',
  'Cherries',
  'Kiwi',
]

const Nav = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>(['Bananas', 'Oranges', 'Apples'])
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Фільтрація продуктів на основі запиту
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = PRODUCTS.filter(product =>
        product.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  // Закриття випадаючого списку при кліку поза компонентом
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSuggestionClick = (product: string) => {
    setSearchQuery(product)
    setIsFocused(false)
    addToRecentSearches(product)
  }

  const handleRecentSearchClick = (product: string) => {
    setSearchQuery(product)
    addToRecentSearches(product)
  }

  const addToRecentSearches = (product: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== product)
      return [product, ...filtered].slice(0, 3)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      addToRecentSearches(searchQuery)
      setIsFocused(false)
    }
  }

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="search-wrapper" ref={searchRef}>
          <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
            <img src={SearchIcon} alt="Search" className="search-icon" />
            <input
              type="text"
              placeholder="Find Products"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              className="search-input"
            />
            <img src={FilterIcon} alt="Filter" className="filter-icon" />
          </div>

          {isFocused && (
            <div className="search-dropdown">
              {suggestions.length > 0 ? (
                <div className="suggestions-list">
                  {suggestions.map((product, index) => {
                    const queryLower = searchQuery.toLowerCase().trim()
                    const productLower = product.toLowerCase()
                    const matchIndex = productLower.indexOf(queryLower)
                    const matchEnd = matchIndex + queryLower.length
                    const isFullMatch = matchIndex === 0 && matchEnd === product.length && queryLower === productLower
                    
                    return (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <img src={SearchIcon} alt="Search" className="suggestion-icon" />
                        <span>
                          {matchIndex !== -1 ? (
                            isFullMatch ? (
                              <span className="suggestion-match">{product}</span>
                            ) : (
                              <>
                                <span className="suggestion-match">{product.slice(0, matchEnd)}</span>
                                {product.slice(matchEnd) && (
                                  <span className="suggestion-rest">{product.slice(matchEnd)}</span>
                                )}
                              </>
                            )
                          ) : (
                            product
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : searchQuery.trim() ? (
                <div className="no-results">No results found</div>
              ) : (
                <div className="recent-searches-section">
                  <h3 className="recent-searches-title">Recent Searches</h3>
                  <div className="recent-searches-list">
                    {recentSearches.map((product, index) => (
                      <button
                        key={index}
                        className="recent-search-button"
                        onClick={() => handleRecentSearchClick(product)}
                      >
                        {product}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav

