import _ from 'lodash'
import {createCleanMap} from './object'

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

type TreeItem<T> = T & {
  [idProp]: string,
  [parentProp]: string,
}
type TreeItemList<T> = Array<TreeItem<T>>

interface IChildrenMap<T> {
  [key: string]: TreeItemList<T>,
}
interface ITreeReturn<T> extends TreeItemList<T> {
  parentsNoFound?: TreeItemList<T>,
}

export function listToTree<T>(list: TreeItemList<T>) {
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
  _.each(childrenMap, (childrenItems: TreeItemList<T>, parentKey: string) => {
    const parentItem = _.find(list, { [idProp]: parentKey })
    if (!parentItem) {
      parentsNoFound.push(parentKey)
      return
    }
    childrenItems.forEach((childrenItem) => {
      if (!parentItem.children) {
        parentItem.children = []
      }
      parentItem.children.push(childrenItem)
    })
  })
  const tree: ITreeReturn<T> = list.filter((item) => !item[parentProp])
  tree.parentsNoFound = parentsNoFound
  return tree
}
