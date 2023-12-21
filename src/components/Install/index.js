import { Button } from '@chakra-ui/react'
import React from 'react'
import { useReactPWAInstall } from 'react-pwa-install'
import { HamburgerIcon } from '@chakra-ui/icons';

const Install = () => {
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall()
  const handleClick = () => {
    pwaInstall({
      title: 'Olivia learn and fun',
      features: (
        <ul>
          <li>Draw a, b, c</li>
          <li>Kintergarden maths add, subtract</li>
          <li>Tic tac toe game</li>
          <li>Works offline</li>
        </ul>
      ),
      description: 'There are lot of feature that needs to be developed but when its done it can do the following. ',
    })
      .then(() =>
        alert('App installed successfully or instructions for install shown')
      )
      .catch(() => alert('User opted out from installing'))
  }

  if (!supported() || isInstalled()) {
    return null
  }

  return (
    <Button
      label="Install"
      rightIcon={<HamburgerIcon />}
      onClick={handleClick}
    />
  )
}

export default Install
