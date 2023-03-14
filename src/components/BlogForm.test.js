import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('The form calls the callback function with the correct data when the new blog is created', async () => {
    const user = userEvent.setup()
    const mockHandler = jest.fn()

    render(<BlogForm addBlog={mockHandler}/>)

    const addButton = screen.getByText('Add')
    const titleInput = screen.getByLabelText('Title:')
    const authorInput = screen.getByLabelText('Author:')
    const urlInput = screen.getByLabelText('Url:')

    await user.type(titleInput, 'Test Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://www.test.fi')
    await user.click(addButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    console.log('mockHandler.mock.calls :>> ', mockHandler.mock.calls);
})