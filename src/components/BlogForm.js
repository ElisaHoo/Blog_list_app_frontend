import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title : newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Add new</h2>
      <form onSubmit={addBlog}>
        <label for="title">Title:</label>
        <input id="title" value={newTitle} onChange={event => setNewTitle(event.target.value)} /><br></br>
        <label for="author">Author:</label>
        <input id="author" value={newAuthor} onChange={event => setNewAuthor(event.target.value)} /><br></br>
        <label for="url">Url:</label>
        <input id="url" value={newUrl} onChange={event => setNewUrl(event.target.value)} /><br></br>
        <button type='submit' id='add-button'>Add</button>
      </form>
    </div>
  )
}

export default BlogForm