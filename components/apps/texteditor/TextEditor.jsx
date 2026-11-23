import React from 'react'
import useDesktopStore from '@/app/store/useDesktopStore'

const TextEditor = ({fileId = "test-file-5"}) => {

    const content = useDesktopStore.getState().getFileContent(fileId)

    
  return (
    <div>
        {content}
    </div>
  )
}

export default TextEditor