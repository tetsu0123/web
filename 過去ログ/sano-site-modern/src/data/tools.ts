import { WritingTool } from '@/types'

export const writingTools: WritingTool[] = [
  {
    id: 'henkan',
    name: '総合変換ツール',
    description: '文章整形の統合ツール',
    path: '/tools/henkan',
  },
  {
    id: 'mojisuu',
    name: '文字数カウンタ',
    description: '文字数＆原稿用紙カウンタ',
    path: '/tools/mojisuu',
  },
  {
    id: 'kaigyou',
    name: '改行削除',
    description: '無駄な改行削除ツール',
    path: '/tools/kaigyou',
  },
  {
    id: 'jisage',
    name: '字下げツール',
    description: '段落の字下げ処理',
    path: '/tools/jisage',
  },
  {
    id: 'zenkaku',
    name: '全角変換',
    description: '半角→全角変換ツール',
    path: '/tools/zenkaku',
  },
  {
    id: 'texttohtml',
    name: 'HTML変換',
    description: 'テキスト→HTML変換',
    path: '/tools/texttohtml',
  },
  {
    id: 'scenario',
    name: 'シナリオ形式',
    description: 'シナリオフォーマット変換',
    path: '/tools/scenario',
  },
  {
    id: 'txttougou',
    name: 'テキスト統合',
    description: '複数テキスト統合',
    path: '/tools/txttougou',
  },
  {
    id: 'pdfketugou',
    name: 'PDF結合',
    description: 'PDF結合ツール',
    path: '/tools/pdfketugou',
  },
  {
    id: 'hozon',
    name: 'ローカル保存',
    description: 'ローカルストレージ保存',
    path: '/tools/hozon',
  },
  {
    id: 'bukken',
    name: '物件情報整形',
    description: '物件情報整形ツール',
    path: '/tools/bukken',
  },
]