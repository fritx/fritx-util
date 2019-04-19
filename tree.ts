import * as _ from 'lodash'
import { createCleanMap } from './object'

const childrenProp = 'children'
const parentProp = 'parent'
const idProp = 'id'

type Tree<T> = Array<{
  [childrenProp]?: Tree<T>,
}>

export function treeToList<T>(tree: Tree<T>) {
  const list = []
  tree.forEach((item) => {
    list.push(item)
    if (item[childrenProp]) {
      const subList = treeToList(item[childrenProp])
      list.push(...subList)
    }
  })
  return list
}

interface ITreeInputMeta {
  [idProp]: string,
  [parentProp]: string,
}
type TreeInput<T> = T & ITreeInputMeta
type TreeInputList<T> = Array<TreeInput<T>>

interface ITreeOutputMeta<T> {
  [childrenProp]?: Array<TreeInput<T>>,
}
type TreeOutput<T> = TreeInput<T> & ITreeOutputMeta<T>
type TreeOutputList<T> = Array<TreeOutput<T>>

interface IChildrenMap<T> {
  [key: string]: TreeOutputList<T>,
}
interface ITreeReturn<T> extends TreeOutputList<T> {
  parentsNoFound: string[],
}

export function listToTree<T extends ITreeInputMeta>(list: TreeInputList<T>) {
  const childrenMap: IChildrenMap<T> = createCleanMap()
  list = _.cloneDeep(list)
  list.forEach((item) => {
    const parentKey = item[parentProp]
    if (parentKey) {
      if (!childrenMap[parentKey]) {
        childrenMap[parentKey] = []
      }
      childrenMap[parentKey].push(item)
    }
  })
  const parentsNoFound = []
  _.each(childrenMap, (childrenItems: TreeInputList<T>, parentKey: string) => {
    const parentItem = _.find(list, { [idProp]: parentKey })
    if (!parentItem) {
      parentsNoFound.push(parentKey)
      return
    }
    childrenItems.forEach((childrenItem) => {
      if (!parentItem[childrenProp]) {
        parentItem[childrenProp] = []
      }
      parentItem[childrenProp].push(childrenItem)
    })
  })
  const tree: TreeOutputList<T> = list.filter((item) => !item[parentProp])
  const ret = tree as ITreeReturn<T>
  ret.parentsNoFound = parentsNoFound
  return ret
}
