import { FC, SVGProps, useEffect, useState } from 'react'
import { takeUntil } from 'rxjs'
import { Box, Snackbar, Typography, useTheme } from '@mui/material'

import { IconMessageError, IconMessageInfo, IconMessageSuccess, IconMessageWarning } from 'src/icons'
import { useDidMountEffect } from 'src/hooks/useDidMountEffect'
import { IMessage, MessageService } from 'src/services/message.service'
import { useUnsubscribe } from 'src/hooks/useUnsubscribe'

import { STMessage } from './styled'
import { EMessage } from 'src/enums'

export const MessagesContainer: FC = () => {
  const theme = useTheme()
  const unsubscribe$ = useUnsubscribe()
  const [openMessage, setOpenMessage] = useState<IMessage>()
  const [messages, setMessages] = useState<IMessage[]>([])

  const icons: { [key in EMessage]: SVGProps<SVGSVGElement>} = {
    [EMessage.SUCCESS]: <IconMessageSuccess/>,
    [EMessage.ERROR]: <IconMessageError/>,
    [EMessage.WARNING]: <IconMessageWarning/>,
    [EMessage.INFO]: <IconMessageInfo/>
  }

  useDidMountEffect(() => {
    const hasClosedMessages = messages.some(message => !message.open)
    if (hasClosedMessages) {
      setMessages(prev => prev.filter(message => message.open))
    }

    const _openMessage = messages.find(message => message.open)
    if (_openMessage) {
      setOpenMessage(() => _openMessage)
    }
  }, [messages])

  useEffect(() => {
    MessageService.message$
      .pipe(takeUntil(unsubscribe$))
      .subscribe(message => setMessages(prev => [...prev, message]))
  }, [unsubscribe$])

  const handleClose = (
    reason?: 'timeout' | 'clickaway' | 'escapeKeyDown',
    id?: IMessage['id']
  ) => {
    if (reason && ['clickaway', 'escapeKeyDown'].includes(reason)) {
      return
    }

    const message = id && messages.find(item => item.id === id)
    if (message) {
      message.open = false
      setMessages(prev => [...prev])

      if (message.onClick) {
        message.onClick(message)
      }
    }
  }

  return (
    <>
      {openMessage && (
        <Snackbar
          key={openMessage.id}
          open={openMessage.open}
          anchorOrigin={openMessage.position}
          autoHideDuration={openMessage.autoHideDuration}
          onClose={(e, reason) => handleClose(reason, openMessage.id)}
          sx={{
            '& .MuiSnackbarContent-root, .MuiSnackbarContent-message, .MuiSnackbarContent-action': {
              width: '100%',
              padding: 0,
              borderRadius: '8px'
            }
          }}
          message={(
            <STMessage>
              <Box display="flex" gap={1}>
                <Box height={24}>
                  {icons[openMessage.severity]}
                </Box>
                <Typography
                  component="div"
                  variant="body2"
                  sx={{
                    wordBreak: 'break-word',
                    lineHeight: '24px',
                    maxWidth: '240px'
                  }}
                >
                  {openMessage.content}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                color={theme.colors['--color-primary-500']}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleClose(undefined, openMessage.id)}
              >
                Close
              </Typography>
            </STMessage>
          )}
        />
      )}
    </>
  )
}
