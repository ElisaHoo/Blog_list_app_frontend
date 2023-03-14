import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog-component...', () => {
  const blog = {
    title: 'Test blog',
    author: 'Test Author',
    url: 'http://www.test.fi',
    likes: 3,
    user: {
      username: 'ttester',
      name: 'Tom Tester',
    }
  }

  const testUser = {
    username: 'ttester',
    name: 'Tom Tester',
  }

  test('renders title and author, but not likes or url', () => {
    const { container } = render(<Blog blog={blog} user={testUser}/>)

    const div = container.querySelector('.blog_part')
    expect(div).toHaveTextContent(blog.title)
    expect(div).toHaveTextContent(blog.author)
    expect(div).not.toHaveTextContent(blog.likes)
    expect(div).not.toHaveTextContent(blog.url)
    expect(div).not.toHaveTextContent(blog.user.name)
  })

  test('renders url, likes and user name when view-button is clicked', async () => {
    const mockHandler = jest.fn()

    const { container } = render(<Blog blog={blog} toggleVisibility={mockHandler} user={testUser}/>)

    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.blog_all')
    expect(div).toHaveTextContent(blog.title)
    expect(div).toHaveTextContent(blog.author)
    expect(div).toHaveTextContent(blog.likes)
    expect(div).toHaveTextContent(blog.url)
    expect(div).toHaveTextContent(blog.user.name)
  })

  test('clicking "+1" like-button twice, calls the eventHandler-function also twice', async () => {
    const mockHandler = jest.fn()

    render(<Blog blog={blog} moreLikes={mockHandler} user={testUser}/>)

    const u = userEvent.setup()
    const viewButton = screen.getByText('View')
    await u.click(viewButton)  // View-button must be clicked first to make like-button visible
    const likeButton = screen.getByText('+1')
    await u.click(likeButton)
    await u.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})