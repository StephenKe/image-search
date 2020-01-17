import React from 'react';
import {AutoComplete, Button, Icon, Input, message, Card, Avatar, Spin } from 'antd';
import './App.css';
import Background from './components/Background'

const { Option } = AutoComplete

interface props {}

interface state {
    value: string,
    dataSource: any,
    loading: boolean
}

let u = new URLSearchParams()
u.append('method', 'flickr.photos.search')
u.append('api_key', '3e7cc266ae2b0e0d78e279ce8e361736')
u.append('format', 'json')
u.append('nojsoncallback', '1')
u.append('safe_search', '1')
u.append('text', 'kittens')
u.append('page', '1')

class App extends React.Component<props, state> {
    constructor(props: object) {
        super(props)
        this.state = {
            value: '',
            dataSource: [],
            loading: false
        }
    }
    photoSort:any = []
    open(url:string) {
        window.open(url, '_blank')
    }
    renderCard(opt:any) {
        let items:any = []
        opt.forEach((op:any) => {
            items.push(<Card
                key={op.id}
                bordered={false}
                hoverable={true}
                style={{display: 'inline-block',margin:5}}
                onClick={() => this.open(`http://farm${op.farm}.static.flickr.com/${op.server}/${op.id}_${op.secret}.jpg`)}
            >
                <Card.Meta
                    avatar={<Avatar
                        size="large"
                        shape="square"
                        alt="failed"
                        src={`http://farm${op.farm}.static.flickr.com/${op.server}/${op.id}_${op.secret}.jpg`} />}
                />
            </Card>)
        })
        return items
    }
    fetchData(u:any) {
        this.setState({
            loading: true
        })
        fetch('https://api.flickr.com/services/rest/?' + u)
            .then((res) => {
                return res.json().then((json) => {
                    this.photoSort = []
                    let photo = json.photos.photo
                    let temp:number = 0
                    for (let i = 0; i < photo.length; i++) {
                        this.photoSort.push([])
                        for (let j = i; j <= i;j+=4) {
                            this.photoSort[temp].push(photo[i])
                            i++
                            this.photoSort[temp].push(photo[i])
                            i++
                            this.photoSort[temp].push(photo[i])
                            i++
                            this.photoSort[temp].push(photo[i])
                            temp++
                        }
                    }
                    const options = this.photoSort.map((opt:any, i:any) => (
                        <Option key={opt[0].id} value={`row ${opt[0].id}`}>
                            {this.renderCard(opt)}
                        </Option>
                    )).concat([
                        <Option disabled key="all" className="show-all">
                            {/*<a onClick={() => this.viewMore((json.photos.page + 1).toString())} rel="noopener noreferrer">*/}
                                {/*View more results*/}
                            {/*</a>*/}
                            <Button onClick={() => this.viewMore((json.photos.page + 1).toString())} type="primary" size="small">
                                View more results
                            </Button>
                        </Option>,
                    ])
                    if (this.state.dataSource.length) {
                        let dataSource = this.state.dataSource
                        dataSource.pop()
                        dataSource = dataSource.concat(options)
                        console.log(111)
                        this.setState({
                            dataSource,
                            loading: false
                        })
                    } else {
                        this.setState({
                            dataSource: options,
                            loading: false
                        })
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    handleClick = () => {
        if (!this.state.value.trim()) {
            message.warning('No Input Content')
            return
        }
        u.delete('text')
        u.append('text', this.state.value)
        this.fetchData(u)
    }
    onChange = (value:any) => {
        this.setState({ value })
    }
    viewMore(page:string) {
        u.delete('page')
        u.append('page', page)
        this.fetchData(u)
    }
    render() {
        return (
            <div className="App">
                <Background />
                <AutoComplete
                    dataSource={this.state.dataSource}
                    style={{ width: 500,marginTop: 200 }}
                    dropdownMenuStyle={{textAlign:'center'}}
                    onChange={this.onChange}
                    placeholder="input here"
                    optionLabelProp="value"
                    notFoundContent={this.state.loading ? <Spin size="small" /> : null}
                >
                    <Input
                        suffix={
                            <Button
                                className="search-btn"
                                style={{ marginRight: -12 }}
                                type="primary"
                                onClick={this.handleClick}
                                loading={this.state.loading}
                            >
                                <Icon type="search" />
                            </Button>
                        }
                    />
                </AutoComplete>
            </div>
        )
    }
}

export default App;
