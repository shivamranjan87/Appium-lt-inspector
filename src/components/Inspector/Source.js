import React, { Component } from 'react';
import { Tree } from 'antd';
import LocatorTestModal from './LocatorTestModal';
import './Inspector.css';

const IMPORTANT_ATTRS = [
  'name',
  'content-desc',
  'resource-id',
  'AXDescription',
  'AXIdentifier',
];

/**
 * Shows the 'source' of the app as a Tree
 */
class Source extends Component {

  getFormattedTag (el) {
    const {tagName, attributes} = el;
    let attrs = [];

    // Don't do translations on Source XML
    for (let attr of IMPORTANT_ATTRS) {
      if (attributes[attr]) {
        attrs.push(<span key={attr}>&nbsp;
          <i
            className='sourceAttrName'
          >{attr}</i>=<span
            className='sourceAttrValue'
          >&quot;{attributes[attr]}&quot;</span>
        </span>);
      }
    }
    return <span>
      &lt;<b className='sourceTag'>{tagName}</b>{attrs}&gt;
    </span>;
  }

  /**
   * Binds to antd Tree onSelect. If an item is being unselected, path is undefined
   * otherwise 'path' refers to the element's path.
   */
  handleSelectElement (path) {
    const {selectElement, unselectElement} = this.props;

    if (!path) {
      unselectElement();
    } else {
      selectElement(path);
    }
  }

  render () {
    const {
      source,
      sourceError,
      setExpandedPaths,
      expandedPaths,
      selectedElement = {},
      t,
    } = this.props;
    const {path} = selectedElement;

    // Recursives through the source and renders a TreeNode for an element
    let recursive = (elemObj) => {
      if (!((elemObj || {}).children || []).length) {return null;}

      return elemObj.children.map((el) => ({
        title: this.getFormattedTag(el),
        key: el.path,
        children: recursive(el),
      }));
    };

    const treeData = source && recursive(source);

    return <div id='sourceContainer' className='tree-container'>
      {source &&
        <Tree
          onExpand={setExpandedPaths}
          autoExpandParent={false}
          expandedKeys={expandedPaths}
          onSelect={(selectedPaths) => this.handleSelectElement(selectedPaths[0])}
          selectedKeys={[path]}
          treeData={treeData} />
      }
      {!source && !sourceError &&
        <i>{('Gathering initial app source…')}</i>
      }
      {/* {
        sourceError && ('couldNotObtainSource', {errorMsg: JSON.stringify(sourceError)})
      } */}
      <LocatorTestModal {...this.props} />
    </div>;
  }
}

//export default withTranslation(Source);

export default Source;

