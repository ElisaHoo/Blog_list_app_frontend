import { useState } from "react"

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
        <h2>Blogs</h2>
        <h3>Create new</h3>
        <form onSubmit={addBlog}>
          Title:
            <input value={newTitle} onChange={event => setNewTitle(event.target.value)} /><br></br>
          Author:
            <input value={newAuthor} onChange={event => setNewAuthor(event.target.value)} /><br></br>
          Url:
            <input value={newUrl} onChange={event => setNewUrl(event.target.value)} /><br></br>
          <button type='submit'>Create</button>
        </form>
      </div>
  )
}

export default BlogForm