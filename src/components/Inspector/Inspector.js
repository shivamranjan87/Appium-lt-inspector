import React, { Component } from 'react';
import { debounce } from 'lodash';
import { INTERACTION_MODE } from './shared';
import { Card, Button, Spin, Tooltip, Modal, Tabs } from 'antd';
import Screenshot from './Screenshot';
import SelectedElement from './SelectedElement';
import Source from './Source';
import './Inspector.css';
import {
  FileTextOutlined,
  TagOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

const ButtonGroup = Button.Group;

const MIN_WIDTH = 1080;
const MIN_HEIGHT = 570;
const MAX_SCREENSHOT_WIDTH = 500;

export default class Inspector extends Component {

  constructor () {
    super();
    this.didInitialResize = false;
    this.state = {};
    this.screenAndSourceEl = null;
    this.lastScreenshot = null;
    this.updateSourceTreeWidth = debounce(this.updateSourceTreeWidth.bind(this), 50);
  }

  updateSourceTreeWidth () {
    // the idea here is to keep track of the screenshot image width. if it has
    // too much space to the right or bottom, adjust the max-width of the
    // screenshot container so the source tree flex adjusts to always fill the
    // remaining space. This keeps everything looking tight.
    if (!this.screenAndSourceEl) {
      return;
    }

    const screenshotBox = this.screenAndSourceEl.querySelector('#screenshotContainer');
    const img = this.screenAndSourceEl.querySelector('#screenshotContainer img#screenshot');

    if (!img) {
      return;
    }

    const imgRect = img.getBoundingClientRect();
    const screenshotRect = screenshotBox.getBoundingClientRect();
    screenshotBox.style.flexBasis = `${imgRect.width}px`;
    if (imgRect.width < screenshotRect.width) {
      screenshotBox.style.maxWidth = `${imgRect.width}px`;
    } else if (imgRect.height < screenshotRect.height) {
      // get what the img width would be if it fills screenshot box height
      const attemptedWidth = (screenshotRect.height / imgRect.height) * imgRect.width;
      screenshotBox.style.maxWidth = attemptedWidth > MAX_SCREENSHOT_WIDTH ?
        `${MAX_SCREENSHOT_WIDTH}px` :
        `${attemptedWidth}px`;
    }
  }

  async componentDidMount(){
    const curHeight = window.innerHeight;
    const curWidth = window.innerWidth;
    const needsResize = (curHeight < MIN_HEIGHT) || (curWidth < MIN_WIDTH);
    if (!this.didInitialResize && needsResize) {
      const newWidth = curWidth < MIN_WIDTH ? MIN_WIDTH : curWidth;
      const newHeight = curHeight < MIN_HEIGHT ? MIN_HEIGHT : curHeight;
      // resize width to something sensible for using the inspector on first run
      window.resizeTo(newWidth, newHeight);
    }
    this.didInitialResize = true;
    console.log("getScreenshotData",this.props)
    // let action = InspectorActions.getScreenshotData()
    // dispatch(action)
    await this.props.getScreenshotData();
    setTimeout(()=>{
      this.props.applyClientMethod({methodName: 'getPageSource', ignoreResult: true});
    },1000)
    window.addEventListener('resize', this.updateSourceTreeWidth);
    // this.startSession();
    // let desiredCapabilities = {
    //   "appium:platform": "Android",
    //   "lt:options": {
    //     "deviceName": "OnePlus 6T",
    //     "platformVersion": "10",
    //     "queueTimeout": 300,
    //     "idleTimeout": "120",
    //     "network": false,
    //     "app": "lt://APP10020521645197705091698",
    //     "devicelog": true
    //   }
    // };
    // this.props.startSession(desiredCapabilities)
  }
  
  componentDidUpdate () {
    const {screenshot} = this.props;
    // only update when the screenshot changed, not for any other kind of
    // update
    if (screenshot !== this.lastScreenshot) {
      this.updateSourceTreeWidth();
      this.lastScreenshot = screenshot;
    }
  }

  render () {
    console.log("inspector",this.props)
    const {screenshot, screenshotError, selectedElement = {},
           isFindingElementsTimes, visibleCommandMethod,
           selectedInteractionMode, selectInteractionMode, setVisibleCommandResult,
           t, visibleCommandResult} = this.props;
    const {path} = selectedElement;

    let main = <div className='inspector-main' ref={(el) => {this.screenAndSourceEl = el;}}>
      <div id='screenshotContainer' className='screenshot-container'>
        {screenshot && <Screenshot {...this.props} />}
        {!screenshot && !screenshotError &&
          <Spin size="large" spinning={true}>
            <div className='screenshotBox' />
          </Spin>
        }
      </div>
      <div id='sourceTreeContainer' className='interaction-tab-container' >
        <Tabs
          size="small"
          //onChange={(tab) => selectInteractionMode(tab)}
          >
          <TabPane tab={('UI Inspector')}>
            <div className='action-row'>
              <div className='action-col'>
                <Card title={<span>TestApp.apk</span>}>
                  <Source {...this.props} />
                </Card>
              </div>
              <div id='selectedElementContainer'
                className='interaction-tab-container element-detail-container action-col'>
                <Card title={<span>{('PROPERTIES TABLE')}</span>}
                  className='selected-element-card'>
                  {path && <SelectedElement {...this.props}/>}
                  {!path && <i>{('selectElementInSource')}</i>}
                </Card>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>;

    const appModeControls = <div className='action-controls'>
      
    </div>;

    let actionControls = <div className='action-controls'>
      
    </div>;

    const generalControls = <ButtonGroup>
      
    </ButtonGroup>;

    let controls = <div className='inspector-toolbar'>
      {appModeControls}
      {actionControls}
      {generalControls}
    </div>;

    return (<Spin spinning={isFindingElementsTimes} key="main">
      <div className='inspector-container'>
        {/* {controls} */}
        {main}
        {/* <Modal
          title={t('Session Inactive')}
          visible={showKeepAlivePrompt}
          onOk={() => keepSessionAlive()}
          onCancel={() => quitSession()}
          okText={t('Keep Session Running')}
          cancelText={t('Quit Session')}
        >
          <p>{t('Your session is about to expire')}</p>
        </Modal> */}
        <Modal
          title={('methodCallResult', {methodName: visibleCommandMethod})}
          visible={!!visibleCommandResult}
          onOk={() => setVisibleCommandResult(null)}
          onCancel={() => setVisibleCommandResult(null)}
        >
          <pre><code>{visibleCommandResult}</code></pre>
        </Modal>
      </div>
    </Spin>);
  }
}



