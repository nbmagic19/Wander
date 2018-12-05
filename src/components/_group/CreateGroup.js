import React, { Component } from 'react';
import { Form, FormGroup, FormControl, Col, ListGroupItem, ListGroup, Row, Alert } from 'react-bootstrap';
import { SearchMembers } from './_groups/SearchMembers';
import { Members } from './_groups/Members';
import _ from 'lodash';
import firebase from 'firebase';

class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: '',
            members: [],
            membersToAdd: [],
            errorMessage: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitGroup = this.submitGroup.bind(this);
    }

    async submitGroup(event) {
        event.preventDefault();
        if(!this.canSubmit()) {
            this.setState({ errorMessage: "Can't create group without a name!" });
        }
        else {
            var uid = firebase.auth();
            var members = this.state.members.map(a => Number(a.value));
            const groupObj = {
                name: this.state.name,
                members: members,
                uid: uid,
            };
            firebase.database.ref(`/groups/users/`)
        }
    }

    addSelectedMember(selectMember) {
        var currentMembers = this.state.members.map(a => a.value).slice();
        var selectedExist = currentMembers.indexOf(selectMember.value);
        if(selectedExist === -1) {
            var editableMembers = this.state.members.slice();
            editableMembers.push(selectMember);
            this.setState({
                members: editableMembers
            });
        }
        else {
            var editableMembers = this.state.members.slice();
            editableMembers.splice(selectedExist, 1);
            this.setState({
                members: editableMembers
            });
        }
    }

    canSubmit() {
        return this.state.name !== '';
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    
    addFriend = event => {
        event.preventDefault()
            if(this.state.email) {
                this.setState({friendEmails: [...this.state.emails, this.state.email
                ]})
            this.props.getUsers({
                email: this.state.email,
                id: Number(this.props.match.params.tripId),
                organizer: false,
                joined: false
            })
            }
        this.setState({email: ''})
    }


    render() {
        const membersAdded = this.state.members.map((member) => <ListGroupItem key={user_id.value}>{user_id.display}</ListGroupItem>)
        const memberSearch = _.debounce((term) => { this.addFriend(term) }, 650);
        const addMember = ((selectedMember) => { this.addSelectedMember(selectedMember) });
        const style = {
            height: "85vh",
        };
        const membersBox = {
            backgroundColor: "#c2e6ff",
            height: "60vh",
            paddingLeft: "30px",
            paddingRight: "30px",
            color: "#555",
            fontFamily: "'Segoe UI', sans-serif",
            overflow: "auto",
            marginBottom: "10px",
            boxShadow: "4px 4px 5px 0px rgba(0,0,0,0.41)",
            borderRadius: "5px"
        }
        return(
            <div style={style}>
                <Row className="empty-space2percent" />
                <Row>
                    <Col md={2} mdOffset={1}>
                        <h1 className="page-subtitle"> Create a Group to Adventure With!</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={3} mdOffset={1}>
                        <div hidden={this.state.errorMessage === ''}>
                            <Alert>{this.state.errorMessage}</Alert>
                        </div>
                        <Form>
                            <FormGroup>
                                <FormControl
                                    placeholder="Group Name"
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        </Form>
                    </Col>
                    <Col md={3}>
                        <SearchMembers onSearchEnter={memberSearch} />
                        <Members membersToAdd={addMember} existingMembers={this.state.members}
                            onMemberSelect={addMember} existingMembers={this.state.members} />
                    </Col>
                    <Col md={4}>
                        <div style={membersBox}>
                            <h3>Travel Buddies!:</h3>
                            <ListGroup>
                                {membersAdded}
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={1} mdOffSet={1}>
                        <a className="smaller-action-buttons" onClick={this.props.returnToGroup}>Back</a>
                    </Col>
                    <Col md={2}>
                        <a className="btn action-button" onClick={(event) => this.submitGroup(event)}>Create Group</a>
                    </Col>
                </Row>
            </div>
        );
    }
}

// export default CreateGroup;