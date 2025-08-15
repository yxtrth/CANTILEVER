import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postService } from '../services/postService';
import { formatDateShort, generateAvatar, stripHtml, truncateText } from '../utils/helpers';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  
  const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business'];

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, category]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 6,
        ...(searchTerm && { search: searchTerm }),
        ...(category && { category })
      };
      
      const response = await postService.getAllPosts(params);
      setPosts(response.data.posts);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const handleCategoryFilter = (selectedCategory) => {
    setCategory(selectedCategory === category ? '' : selectedCategory);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Retro Hero Section */}
      <section className="hero-section">
        <div className="container">
          <center>
            <table border="3" cellPadding="10" cellSpacing="0" bgcolor="#FFFF00">
              <tr>
                <td align="center">
                  <font face="Impact" size="7" color="#FF0000">
                    <blink>WELCOME TO THE RETRO BLOG ZONE!</blink>
                  </font>
                  <br/>
                  <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="100" height="20" alt="Cool divider"/>
                  <br/>
                  <font face="Comic Sans MS" size="4" color="#0000FF">
                    <b>Discover AMAZING stories, insights, and ideas from our RADICAL community!</b>
                  </font>
                  <br/><br/>
                  <a href="/register" className="btn retro-btn-large">
                    <font face="Arial Black" size="3">
                      JOIN THE REVOLUTION!
                    </font>
                  </a>
                </td>
              </tr>
            </table>
          </center>
        </div>
      </section>

      <div className="container">
        <table width="100%" border="2" cellPadding="10" cellSpacing="5" bgcolor="#C0C0C0">
          <tr>
            <td width="70%" valign="top" bgcolor="#FFFFFF">
              {/* Retro Search and Filters */}
              <table width="100%" border="1" cellPadding="5" bgcolor="#FFFFCC">
                <tr>
                  <td>
                    <font face="Arial" size="3" color="#FF0000">
                      <b>SEARCH THE ARCHIVES:</b>
                    </font>
                    <form onSubmit={handleSearch}>
                      <input
                        type="text"
                        className="retro-input"
                        placeholder="Enter search terms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          border: '2px inset #c0c0c0',
                          padding: '4px',
                          fontFamily: 'Courier New',
                          fontSize: '12px',
                          width: '200px'
                        }}
                      />
                      <button type="submit" className="nav-button" style={{marginLeft: '10px'}}>
                        SEARCH!
                      </button>
                    </form>
                  </td>
                </tr>
                <tr>
                  <td>
                    <font face="Arial" size="2" color="#008000">
                      <b>CATEGORIES:</b>
                    </font>
                    <br/>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`retro-category-btn ${category === cat ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter(cat)}
                        style={{
                          background: category === cat ? '#FF0000' : '#C0C0C0',
                          color: category === cat ? '#FFFFFF' : '#000000',
                          border: category === cat ? '2px inset #FF0000' : '2px outset #C0C0C0',
                          margin: '2px',
                          padding: '4px 8px',
                          fontFamily: 'MS Sans Serif',
                          fontSize: '10px'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                    {(searchTerm || category) && (
                      <>
                        <br/>
                        <button onClick={clearFilters} className="nav-button">
                          CLEAR FILTERS
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              </table>

              {/* Search Results Info */}
              {(searchTerm || category) && (
                <table width="100%" border="1" cellPadding="3" bgcolor="#FFCCCC">
                  <tr>
                    <td>
                      <font face="Arial" size="2">
                        {searchTerm && <b>Search results for: "{searchTerm}"</b>}
                        {category && <b>Category: {category}</b>}
                      </font>
                    </td>
                  </tr>
                </table>
              )}

              {/* Retro Posts Display */}
              {loading ? (
                <center>
                  <font face="Arial" size="4" color="#FF0000">
                    <blink>LOADING POSTS...</blink>
                  </font>
                  <br/>
                  <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="50" height="50" alt="Loading..."/>
                </center>
              ) : posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <table key={post._id} width="100%" border="2" cellPadding="8" cellSpacing="0" bgcolor="#FFFFCC" style={{marginBottom: '10px'}}>
                      <tr>
                        <td width="20%" bgcolor="#CCCCFF">
                          {post.featuredImage ? (
                            <img 
                              src={post.featuredImage} 
                              alt={post.title}
                              width="100"
                              height="80"
                              border="2"
                              style={{border: '2px inset #C0C0C0'}}
                            />
                          ) : (
                            <table border="1" cellPadding="10" bgcolor="#CCCCCC">
                              <tr>
                                <td align="center">
                                  <font face="Arial" size="1">NO IMAGE</font>
                                </td>
                              </tr>
                            </table>
                          )}
                        </td>
                        <td width="80%" bgcolor="#FFFFFF">
                          <font face="Times New Roman" size="4" color="#000080">
                            <b><u>
                              <a href={`/post/${post._id}`} style={{color: '#000080', textDecoration: 'underline'}}>
                                {post.title}
                              </a>
                            </u></b>
                          </font>
                          <br/>
                          <font face="Arial" size="1" color="#008000">
                            By: {post.author.firstName} {post.author.lastName} | 
                            {formatDateShort(post.publishedAt || post.createdAt)} | 
                            Category: {post.category}
                          </font>
                          <br/><br/>
                          <font face="Times New Roman" size="2">
                            {post.excerpt || truncateText(stripHtml(post.content), 150)}
                          </font>
                          <br/><br/>
                          <font face="Arial" size="1">
                            <b>Stats:</b> ❤️ {post.likes.length} | 💬 {post.comments.length} | 👁️ {post.views}
                          </font>
                          {post.tags && post.tags.length > 0 && (
                            <>
                              <br/>
                              <font face="Courier New" size="1" color="#FF0000">
                                <b>Tags:</b> {post.tags.map((tag, index) => `#${tag}`).join(' ')}
                              </font>
                            </>
                          )}
                        </td>
                      </tr>
                    </table>
                  ))}

                  {/* Retro Pagination */}
                  {totalPages > 1 && (
                    <center>
                      <table border="1" cellPadding="5" bgcolor="#CCCCCC">
                        <tr>
                          <td>
                            <button
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="nav-button"
                            >
                              ← PREV
                            </button>
                          </td>
                          {[...Array(totalPages)].map((_, index) => (
                            <td key={index + 1}>
                              <button
                                onClick={() => setCurrentPage(index + 1)}
                                className="nav-button"
                                style={{
                                  background: currentPage === index + 1 ? '#FF0000' : '#C0C0C0',
                                  color: currentPage === index + 1 ? '#FFFFFF' : '#000000'
                                }}
                              >
                                {index + 1}
                              </button>
                            </td>
                          ))}
                          <td>
                            <button
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="nav-button"
                            >
                              NEXT →
                            </button>
                          </td>
                        </tr>
                      </table>
                    </center>
                  )}
                </>
              ) : (
                <center>
                  <table border="3" cellPadding="20" bgcolor="#FFCCCC">
                    <tr>
                      <td align="center">
                        <font face="Arial Black" size="5" color="#FF0000">
                          NO POSTS FOUND!
                        </font>
                        <br/>
                        <font face="Comic Sans MS" size="3">
                          {searchTerm || category 
                            ? 'Try different search terms or categories!' 
                            : 'Be the FIRST to share your amazing story!'
                          }
                        </font>
                        <br/><br/>
                        <a href="/register" className="nav-button">GET STARTED NOW!</a>
                      </td>
                    </tr>
                  </table>
                </center>
              )}
            </td>

            {/* Retro Sidebar */}
            <td width="30%" valign="top" bgcolor="#CCFFCC">
              <table width="100%" border="1" cellPadding="8" bgcolor="#FFFFCC">
                <tr>
                  <td>
                    <font face="Arial Black" size="3" color="#FF0000">
                      POPULAR CATEGORIES
                    </font>
                    <br/>
                    {categories.map((cat) => (
                      <font key={cat} face="Arial" size="2">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="10" height="10" alt="*"/>
                        <button
                          onClick={() => handleCategoryFilter(cat)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: category === cat ? '#FF0000' : '#0000FF',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '12px'
                          }}
                        >
                          {cat}
                        </button>
                        <br/>
                      </font>
                    ))}
                  </td>
                </tr>
              </table>

              <br/>

              <table width="100%" border="1" cellPadding="8" bgcolor="#CCCCFF">
                <tr>
                  <td>
                    <font face="Arial Black" size="3" color="#0000FF">
                      ABOUT THIS SITE
                    </font>
                    <br/>
                    <font face="Times New Roman" size="2">
                      Welcome to our AWESOME retro blog platform! Here writers and readers 
                      unite to share the most RADICAL ideas and stories!
                    </font>
                  </td>
                </tr>
              </table>

              <br/>

              <table width="100%" border="1" cellPadding="8" bgcolor="#FFCCFF">
                <tr>
                  <td align="center">
                    <font face="Arial Black" size="3" color="#FF00FF">
                      JOIN THE PARTY!
                    </font>
                    <br/>
                    <font face="Comic Sans MS" size="2">
                      Sign up NOW and become part of our totally awesome community!
                    </font>
                    <br/><br/>
                    <a href="/register" className="nav-button signup-btn">
                      SIGN UP TODAY!
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default Home;
