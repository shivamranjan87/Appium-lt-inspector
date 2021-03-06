import React, { Component } from 'react';
import { Input, Select, Row } from 'antd';
import './Inspector.css';

const { Option } = Select;

class ElementLocator extends Component {

  onSubmit () {
    const {locatedElements, locatorTestStrategy, locatorTestValue, searchForElement, clearSearchResults, hideLocatorTestModal} = this.props;
    if (locatedElements) {
      hideLocatorTestModal();
      clearSearchResults();
    } else {
      searchForElement(locatorTestStrategy, locatorTestValue);
    }
  }

  onCancel () {
    const {hideLocatorTestModal, clearSearchResults} = this.props;
    hideLocatorTestModal();
    clearSearchResults();
  }

  render () {
    const {
      setLocatorTestValue,
      locatorTestValue,
      setLocatorTestStrategy,
      locatorTestStrategy,
      t,
    } = this.props;

    const locatorStrategies = [
      ['id', 'Id'],
      ['xpath', 'XPath'],
      ['name', 'Name'],
      ['class name', 'Class Name'],
      ['accessibility id', 'Accessibility ID'],
      ['-android uiautomator', 'UIAutomator Selector (Android UiAutomator2)'],
      ['-android datamatcher', 'DataMatcher Selector (Android Espresso)'],
      ['-android viewtag', 'Android View Tag (Android Espresso)'],
      ['-ios predicate string', 'Predicate String (iOS)'],
      ['-ios class chain', 'Class Chain (iOS)'],
    ];

    return <div>
      <Row>
        {'locatorStrategy'}
        <Select className='locator-strategy-selector'
          onChange={(value) => setLocatorTestStrategy(value)}
          value={locatorTestStrategy}>
          {locatorStrategies.map(([strategyValue, strategyName]) => (
            <Option key={strategyValue} value={strategyValue}>{strategyName}</Option>
          ))}
        </Select>
      </Row>
      <Row>
        {'selector'}
        <Input.TextArea className='locator-strategy-selector' onChange={(e) => setLocatorTestValue(e.target.value)} value={locatorTestValue} />
      </Row>
    </div>;
  }
}

//export default withTranslation(ElementLocator);

export default ElementLocator;



