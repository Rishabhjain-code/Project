import React, { Component, createRef, useState } from "react";
import "./SearchBar.css";
import axios from "axios";
import SearchUser from "./SearchUser/SearchUser";

class SearchBar extends Component {
    state = {
        users: [],
        followings: []
    };

    componentDidMount() {
        // BETTER DONE AT APP.JS TO AVOID RECALC EVERYTIME.

        // let users;
        // let followingsArr;
        // let arr = [];
        // axios.get("/api/user").then((obj) => {
        //     users = obj.data.data;
        //     console.log(users);
        //     for (let i = 1; i <= Math.min(12, users.length); i++) {
        //         arr.push(users[i]);
        //     }
        // }).catch(error => {
        //     console.log(error);
        // })

        // let user_id = this.props.uid;
        // axios({
        //     method: "get",
        //     url: "/api/request/following/" + user_id
        // }).then((obj) => {
        //     followingsArr = obj.data.following
        //     // remember that axios is async hence update when promise returned fullfilled if written down it will collapse
        //     // as by then axios not wokred fully as prmise was pending
        //     this.setState({
        //         users: arr,
        //         followings: followingsArr
        //     })
        // }).catch((error) => {
        //     console.log(error);
        // })

        // WRONG

        // this.setState({
        //     users: arr,
        //     followings: followingsArr
        // })

        this.setState({
            users: this.props.searchBarUsers,
            followings: this.props.userFollowings
        })

    }




    render() {
        // const listItems = data.map((d) => <li key={d.name}>{d.name}</li>); // stack overflow
        // not foreach use the map instead here
        let data = this.state.users.map(element => {
            if (element.uid != "829d307c-3f7a-4d17-9f02-e2674a2e025d")
                return <SearchUser uid={this.props.uid} element={element} followings={this.state.followings}></SearchUser>

        })

        return (
            <div className="searchbar-box">
                {data}
            </div>
        );
    }
}

export default SearchBar;