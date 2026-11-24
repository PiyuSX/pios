import useDesktopStore from '@/app/store/useDesktopStore'

const TextEditor = ({fileId}) => {

  const content = useDesktopStore((state) => 
   state.desktopItems.find((item) => item.id === fileId)?.content ?? ""
  )

    
  return (
    <div className='p-4'>
        {content}
    </div>
  )
}

export default TextEditor