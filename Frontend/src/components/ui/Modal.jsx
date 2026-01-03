import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
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
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
              </motion.div>
              <Dialog.Content
                className={`
                  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  glass-strong rounded-xl shadow-card border border-white/50 z-50
                  w-full ${sizes[size]}
                  max-h-[90vh] overflow-y-auto
                `}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {title && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <Dialog.Title className="text-xl font-bold text-gray-900">
                        {title}
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Close"
                        >
                          <X size={20} className="text-gray-500" />
                        </motion.button>
                      </Dialog.Close>
                    </div>
                  )}
                  <div className={title ? 'p-6' : 'p-6 pt-6'}>{children}</div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
