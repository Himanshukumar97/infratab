import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from './Store/action';
import * as actionTypes from './Store/actionTypes';
import cx from 'classnames';
import styles from "./BankHome.module.scss";
import { NavLink, Link } from "react-router-dom";
import leftArrow from './../icons/left.svg';
import rightArrow from './../icons/right.svg';
class BankHome extends Component {


    state = {
        displayBank: [],
        rowsPerPage: 10,
        pageNum: 1,
        totalPage: 1,
        searchEnable: false,
        searchArray: [],
        totalSearchPage: 1,
        filter: "ifsc",
        searchString:""
    }
    timeout = null;

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        // Get data
        let data = JSON.parse(localStorage.getItem('cacheBankData'));

        if (!data)
            this.props.getBankData();
        else
            this.props.getBanKdataFromCache();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!(_.isEqual(prevProps.bankData, this.props.bankData)) && !this.state.searchEnable) {

            this.display();
            this.NumberofRowsPerPageChange();

        }
        if (this.state.rowsPerPage !== prevState.rowsPerPage) {
            this.NumberofRowsPerPageChange();
            if (!this.state.searchEnable)
                this.display();
        }
        if (this.state.pageNum !== prevState.pageNum) {
            this.display();
        }
        if (prevState.searchArray !== this.state.searchArray && this.state.searchArray.length != 0) {
            this.NumberofRowsPerPageChange();
        }
        if (prevState.searchEnable !== this.state.searchEnable) {
            this.display();
        }
        if (!(_.isEqual(this.state.filter, prevState.filter))) {
            
            this.display() ;
        }

    }


    componentWillMount() {

    }

    display = () => {
        let displayBank;

        if (this.state.searchEnable)
            displayBank = _.cloneDeep(this.state.searchArray);
        else
            displayBank = _.cloneDeep(this.props.bankData);

        let tempPageNum = (this.state.pageNum - 1) * this.state.rowsPerPage;

        let lengthOfBank = displayBank.length;

        displayBank = displayBank.slice(tempPageNum, (tempPageNum + this.state.rowsPerPage - 1) < lengthOfBank ?
            tempPageNum + (this.state.rowsPerPage % lengthOfBank) : tempPageNum + (this.state.rowsPerPage));



        
        this.setState({ displayBank: displayBank })

    }

    displaySearch = () => {
        let totalLength = this.state.searchArray.length;
        let displayBank = [];

        let tempPageNum = (this.state.pageNum - 1) * this.state.rowsPerPage;

        displayBank = displayBank.slice(tempPageNum, (tempPageNum + this.state.rowsPerPage - 1) < totalLength ?
            tempPageNum + (this.state.rowsPerPage % totalLength) : tempPageNum + (this.state.rowsPerPage));



        this.setState({ displayBank: displayBank });

    }
    NumberofRowsPerPageChange = () => {
        let totalLength = this.props.bankData.length;
        let totalSearchLength = this.state.searchArray.length;
        let rowsPerPage = this.state.rowsPerPage;
        let totalSearchPage = 1;
        if (this.state.searchEnable) {

            totalSearchPage = parseInt(totalSearchLength / rowsPerPage);
            if (rowsPerPage % totalSearchLength != 0) {
                totalSearchPage += 1;
            }
            
        }
        let totalPage = parseInt(totalLength / rowsPerPage);
        if (rowsPerPage % totalLength != 0) {
            totalPage += 1;
        }

        this.setState({ totalPage: totalPage, totalSearchPage: totalSearchPage });


    }
    handlePrevDisableCheck = (InputIdentifier) => {
        let disableProp = false;


        if (InputIdentifier === "left" && this.state.pageNum === 1)
            disableProp = true;
        else if (!this.state.searchEnable && InputIdentifier === "right" && this.state.pageNum === this.state.totalPage)
            disableProp = true;
        else if (this.state.searchEnable && InputIdentifier === "right" && this.state.pageNum === this.state.totalSearchPage)
            disableProp = true;

        
        return disableProp;
    }
    pageChange = (InputIdentifier) => {

        let pageNum = this.state.pageNum;
        if (InputIdentifier === "right") {
            pageNum += 1;
        }
        else if (InputIdentifier === "left") {
            pageNum -= 1;
        }
        this.setState({ pageNum: pageNum });
    }
    checkContains = (obj, searchString, searchStringLength) => {

        if(this.state.filter === "favourite")
        {
            if('favourite' in obj )
            {
                let val = obj[this.state.filter];
                
                val = val.toString();
                searchString = searchString.toString();
                val = val.slice(0, searchStringLength);
                if (_.isEqual(val, searchString))
                    return true;
                return false;
            }
        }
        else{
            let val = obj[this.state.filter];
        
        val = val.toString();
        searchString = searchString.toString();
        val = val.slice(0, searchStringLength);
        if (_.isEqual(val, searchString))
            return true;
        return false;
        }
        
    }
    searchBankOnQuery = (searchString,searchStringLength) => {
        
        if(searchStringLength !== 0)
        {
            let thisRef = this ;
            let input = document.getElementById('searchBank');
                input.addEventListener('keyup', function (e) {
                    // Clear the timeout if it has already been set.
                    // This will prevent the previous task from executing
                    // if it has been less than <MILLISECONDS>
                    clearTimeout(thisRef.timeout);
    
                    // Make a new timeout set to go off in 1000ms (1 second)
                    thisRef.timeout = setTimeout(function () {
                        let searchArray = [];
                        let i = 0;
                        
                        let bankArray = _.cloneDeep(thisRef.props.bankData);
                        // searchArray = bankArray.filter(obj => 
                        //     Object.values(obj).findIndex(val => this.checkContains(val, searchString, searchStringLength,obj)) > -1
                        // )
                        searchArray = bankArray.filter(obj =>
                            thisRef.checkContains(obj, searchString, searchStringLength)
                        )
    
                        let searchArrayOriginal = searchArray;
                        if (searchArray.length > thisRef.state.rowsPerPage)
                            searchArray = searchArray.slice(0, thisRef.state.rowsPerPage);
    
                        thisRef.setState({ displayBank: searchArray, searchEnable: true, searchArray: searchArrayOriginal, pageNum: 1,searchString:searchString })
                        
    
                    }, 1000);
                });
                

        }
        

    }
    changeSearch = (event) => {
        let searchString = event.target.value;

        searchString = searchString.toString();

        let searchStringLength = searchString.length;

        
        if (searchStringLength === 0) {
            clearTimeout(this.timeout);
            this.setState({ searchArray: [], searchEnable: false, pageNum: 1 ,searchString:searchString})

        }
        else {
            this.searchBankOnQuery(searchString,searchStringLength) ;
        }
        

    }
    changeFilter = (event) => {
        let filter = event.target.value;
        document.getElementById('searchBank').value = "";
    
        this.setState({ filter: filter,pageNum:1,searchEnable:false});
    }
    favourite = (event) => {
        if(event.target.value === "favourite")
        {
            
            
        }else if(event.target.value === "All")
        {
            
        }
    }

    render() {

        return (
            <div>
                <div >
                    <input type="text" id="searchBank" onChange={(event) => this.changeSearch(event)} placeholder="Search.." />
                    <label className={cx("ml-2")}>Choose a filter:</label>

                    <select onChange={(event) => this.changeFilter(event)} id="Filter">
                        <option value="ifsc">IFSC</option>
                        <option value="bank_id">Bank ID</option>
                        <option value="address">Address</option>
                        <option value="bank_name">Bank Name</option>
                        <option value="branch">Branch</option>
                        <option value="favourite">favourite</option>
                    </select>
                    

                </div>
                <div className={cx("pt-4 ", styles.main)}>

                    <div className={cx("mt-5", styles.scroll)}>
                        {this.state.displayBank.length > 0 ? this.state.displayBank.map((resource, index) => {
                            let url = "/infratab/bank/"+index+"/" + resource.ifsc;
                            return (
                                <NavLink to={url}>
                                    <div className={cx("pl-3", styles.clientCardAlign)} key={index}>
                                        <div className={styles.ResourceCard}>
                                            <div style={{}}>
                                                <div className={styles.cardTextMedium}>Bank Name : {resource.bank_name}</div>
                                                <div className={styles.cardTextMedium}>IFSC : {resource.ifsc}</div>
                                                <div className={styles.cardTextMedium}>Branch : {resource.branch}</div>
                                                <div className={styles.cardTextMedium}>Bank ID : {resource.bank_id}</div>
                                                <div className={styles.cardTextMedium}>Address : {resource.address}</div>
                                            </div>
                                        </div>

                                    </div>
                                </NavLink>
                            )
                        }) : null}
                    </div>
                </div>


                <span >
                    <button
                        className={cx({ [styles.ArrowDisable]: this.handlePrevDisableCheck("left") }, styles.Arrow)}
                        disabled={this.handlePrevDisableCheck("left")}
                        onClick={() => this.pageChange("left")}
                    >
                        <img src={leftArrow} alt="arrow" />
                    </button>
                </span>
                <span >
                    <button
                        className={cx({ [styles.ArrowDisable]: this.handlePrevDisableCheck("right") }, styles.Arrow)}
                        disabled={this.handlePrevDisableCheck("right")}
                        onClick={() => this.pageChange("right")}
                    >
                        <img src={rightArrow} alt="arrow" />
                    </button>
                </span>


            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        bankData: state.BankData
    };
};



const mapDispatchToProps = dispatch => {
    return {
        getBankData: () => dispatch(actions.getBankData()),
        getBanKdataFromCache: () => dispatch(actions.getBanKdataFromCache())
    };
};

export default (connect(mapStateToProps, mapDispatchToProps)(BankHome));