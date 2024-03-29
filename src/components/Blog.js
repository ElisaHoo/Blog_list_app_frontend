import { useState } from 'react'

const Blog = ({ blog, user, updateLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const moreLikes = async (event) => {
    event.preventDefault()
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    }
    updateLikes(blog.id, updatedBlog)
  }

  const deleteBlog = async (event) => {
    event.preventDefault()
    removeBlog(blog.id)
  }

  const blogStyle = {
    padding: 5,
    marginTop: 5,
    border: 'solid',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 5
  }

  if (visible) {
    return (
      <div style={blogStyle} className='blog_all' display={showWhenVisible}>
        <div>{blog.title}, author {blog.author} <button onClick={toggleVisibility} id='hide-button'>Hide</button></div>
        <div>{blog.url}</div>
        <div>Likes {blog.likes} <button onClick={moreLikes} id='like-button'>+1</button></div>
        <div>Added by {blog.user.name}</div>
        {blog.user.name === user.name
          ? <button style={{ backgroundColor: 'red' }} onClick={deleteBlog} id='delete-button'>Delete</button>
          : null
        }
      </div>
    )
  } else {
    return(
      <div style={blogStyle} className='blog_part' display={hideWhenVisible}>
        {blog.title}, {blog.author} <button onClick={toggleVisibility} id='view-button'>View</button>
      </div>
    )
  }
}

export default Blog