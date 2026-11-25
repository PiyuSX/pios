"use client"


import useDesktopStore from '@/app/store/useDesktopStore'
import { useState, useEffect } from 'react'
import { notify } from '@/app/store/useNotificationStore'


const TextEditor = ({ fileId, onRegisterClose }) => {

  const file = useDesktopStore((state) => 
  state.desktopItems.find((item) => item.id === fileId)
  )

  const updateFileContent = useDesktopStore(
    (state) => state.updateFileContent
  )

  const [content, setContent] = useState(file?.content ?? "")
  const [saved, setSaved] = useState(true)

  const [warned, setWarned] = useState(false)

  const [readOnlyWarned, setReadOnlyWarned] = useState(false)


  const handleReadOnly = () => {
    if (file.isSystem && !readOnlyWarned) {
      notify("Sigma Editor", "My file is read-only! Make a new one to write, and please leave a feedback in Comment Folder. 😹", 6000)
      setReadOnlyWarned(true)
    }
  }



  useEffect(() => {
    setContent(file?.content ?? "")
    setSaved(true)
    setWarned(false)
    setReadOnlyWarned(false)
  }, [fileId])


  const handleChange = (e) => {
    setContent(e.target.value)
    setSaved(false)
  }


  const handleSave = () => {
    updateFileContent(fileId, content)
    setSaved(true)
    setWarned(false)
  }


  const handleClose = () => {
    if (!saved && !warned && !file.isSystem) {
      notify("Sigma Editor", "Mate it , it will get lost 😿 Save it!")
      setWarned(true)
      return false
    }
    return true
  }

  useEffect(() => {
    onRegisterClose?.(handleClose)
  }, [saved, file, onRegisterClose, warned])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        updateFileContent(fileId, content)
        setSaved(true)
        setWarned(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)

  }, [content, fileId, updateFileContent])


  if (!file) {
    return <div className='p-4'>File not found.</div>
  }


  


    
  return (
    <div className='flex h-full min-h-0 flex-col bg-background text-muted'>
      <div className='flex items-center justify-between px-4 py-2'>
        <span className="text-sm font-medium">
            {file.filename}
        </span>
        <span className={`text-xs ${saved ? "text-muted" : "text-[#FFBD44]"}`}>
          {saved ? "Saved": "Unsaved changes"}

        </span>

      </div>

      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleReadOnly}
        placeholder='Start typing...'
        spellCheck={false}
        className={`min-h-0 flex-1 resize-none bg-background p-5 font-mono text-sm leading-7 outline-none cursor-text pointer-events-auto 
           ${file.isSystem ? "cursor-not-allowed" : "cursor-text"}
          `}
      />

        <div className="flex justify-between px-4 py-2 text-xs text-muted">
          <span>{content.length} characters</span>
          <span>{content.split("\n").length} lines</span>
        </div>

      
        
    </div>
  )
}

export default TextEditor
