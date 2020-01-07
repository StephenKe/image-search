import React from 'react';
import { Card, Icon, Button, Tooltip, Modal, Input, message, Table, Popconfirm } from 'antd';
import './App.css';
import Background from './components/Background'
import { TweenOneGroup } from 'rc-tween-one'
import Texty from 'rc-texty'

const { TextArea } = Input

const TableContext = React.createContext(false)

interface props {}

interface state {
    visible: boolean,
    textAreaVal: string,
    tasks: any,
    isPageTween: boolean,
    selectedRowKeys: Array<number>
}

class App extends React.Component<props, state> {
    constructor(props: object) {
        super(props)
        this.state = {
            visible: false,
            isPageTween: false,
            textAreaVal: '',
            selectedRowKeys: [],
            tasks: [{key:new Date().getTime(),task:'Cosmos/ATOM/BTC'},{key:new Date().getTime() + Math.random(),task:'bilibili memeda'},{key:new Date().getTime() + Math.random(),task:'League of Legends'},{key:new Date().getTime() + Math.random(),task:'Come on baby'},{key:new Date().getTime() + Math.random(),task:'Goodbye Baby'}]
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    handleTextArea = (e: any) => {
        e.persist()
        this.setState({
            textAreaVal: e.target.value,
        })
    }
    handleOk = () => {
        if (!this.state.textAreaVal.trim()) {
            message.warning('No Content')
            return
        }
        const tasks = this.state.tasks.concat({key: new Date().getTime() + Math.random(), task: this.state.textAreaVal})
        this.setState(preState => ({
            tasks,
            isPageTween: false
        }), () => {
            this.setState({
                visible: false,
                textAreaVal: ''
            })
        })
    }
    delTaskByIndex = (index: number) => {
        const tasks = this.state.tasks.filter((item: any) => {
            return item.key !== index
        })
        this.setState(preState => ({
            tasks,
            isPageTween: false
        }))
    }
    columns = [
        {
            title: '',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'TASK',
            dataIndex: 'task',
            key: 'task',
            width: '50%',
            render: (text: any, record: any) => {
                if (~this.state.selectedRowKeys.indexOf(record.key)) {
                    return (
                        <Texty className='done' type='bounce'>{record.task}</Texty>
                    )
                }
                return (
                    <span className='undone'>{record.task}</span>
                )
            }
        },
        {
            title: 'OPERATION',
            dataIndex: 'operation',
            key: 'operation',
            render: (text: any, record: any) =>
                this.state.tasks.length >= 1 ? (
                    <Popconfirm title="Sure to delete?"
                                onConfirm={() => {this.delTaskByIndex(Number(record.key))}}
                    >
                        <Button type="link">Delete</Button>
                    </Popconfirm>
                ) : null
        }
    ]
    rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // console.log(selectedRowKeys)
            this.setState({
                selectedRowKeys
            })
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
        })
    }
    onEnd = (e: any) => {
        const dom = e.target
        dom.style.height = 'auto'
    }
    enterAnim = [
        {
            opacity: 0, x: 30, backgroundColor: '#fffeee',duration: 0
        },
        {
            height: 0,
            duration: 100,
            type: 'from',
            delay: 100,
            ease: 'easeOutQuad',
            onComplete: this.onEnd,
        },
        {
            opacity: 1, x: 0, duration: 100, ease: 'easeOutQuad'
        },
        { delay: 1000, backgroundColor: '#fff' }
    ]
    pageEnterAnim = [
        {
            opacity: 0, duration: 0,
        },
        {
            height: 0,
            duration: 150,
            type: 'from',
            delay: 150,
            ease: 'easeOutQuad',
            onComplete: this.onEnd,
        },
        {
            opacity: 1, duration: 150, ease: 'easeOutQuad'
        }
    ]
    leaveAnim = [
        { duration: 350, opacity: 0 },
        { height: 0, duration: 300, ease: 'easeOutQuad' }
    ]
    pageLeaveAnim = [
        { duration: 150, opacity: 0 },
        { height: 0, duration: 150, ease: 'easeOutQuad' }
    ]
    animTag = ($props: any) => {
        return (
            <TableContext.Consumer>
                {(isPageTween) => {
                    return (
                        <TweenOneGroup
                            component="tbody"
                            enter={!isPageTween ? this.enterAnim : this.pageEnterAnim }
                            leave={!isPageTween ? this.leaveAnim : this.pageLeaveAnim}
                            appear={true}
                            exclusive
                            {...$props}
                        />
                    )
                }}
            </TableContext.Consumer>
        )
    }
    pageChange = () => {
        this.setState({
            isPageTween: true
        })
    }
    render() {
        return (
            <div className="App">
                <Background />
                <Modal
                    title="Add Task"
                    style={{ left:90,top: 20 }}
                    width={300}
                    mask={false}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={() => {this.setState({
                        visible: false
                    })}}
                >
                    <TextArea rows={4} value={this.state.textAreaVal} onChange={this.handleTextArea} />
                </Modal>
                <Card
                    title={
                        <h2 style={{ marginBottom: 0 }}> <Icon type="schedule" style={{ marginRight: 10 }}/>TO-DO LIST</h2>
                    }
                    bordered={false}
                    style={{ width: '80%',maxWidth: '100%',textAlign: 'justify' }}
                    className="card"
                    extra={
                        <Tooltip placement="top" title="Click To Add Task" arrowPointAtCenter>
                            <Button type="primary" shape="circle" icon="plus" onClick={this.showModal} />
                        </Tooltip>
                    }
                >
                    <TableContext.Provider value={this.state.isPageTween}>
                        <Table
                            columns={this.columns}
                            pagination={false}
                            dataSource={this.state.tasks}
                            rowSelection={this.rowSelection}
                            components={{ body: { wrapper: this.animTag } }}
                            onChange={this.pageChange}
                        />
                    </TableContext.Provider>
                </Card>
            </div>
        )
    }
}

export default App;
