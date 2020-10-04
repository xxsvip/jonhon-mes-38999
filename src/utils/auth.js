import Cookies from 'js-cookie'
import request from './request'

const TokenKey = 'MES-Token'  //设置cookie中放置token名称。

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

