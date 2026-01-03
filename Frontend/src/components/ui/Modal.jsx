import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const Modal = ({ open, onOpenChange, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
        <Dialog.Content
          className={`
            fixed z-50
            top-[50%] left-[50%]
            -translate-x-1/2 -translate-y-1/2
            glass-strong rounded-xl shadow-card border border-white/50
            w-full ${sizes[size]}
            max-h-[85vh] overflow-y-auto
            outline-none
          `}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-10 rounded-t-xl">
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </Dialog.Close>
            </div>
          )}
          <Dialog.Description className="sr-only">
            {title || 'Dialog'}
          </Dialog.Description>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            className={title ? 'p-6' : 'p-6 pt-6'}
          >
            {children}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
