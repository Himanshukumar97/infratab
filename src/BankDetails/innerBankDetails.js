import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from './Store/action';
import styles from "./BankHome.module.scss";
class BankHome extends Component {


    state = {
        ifscParams: null,
        index : null
    }


    componentDidMount() {
        // Get data
        this.props.getBanKdataFromCache();
        const { match } = this.props;
        let ifscParams = match.params.bankID;
        let index = match.params.index ;
        this.setState({ ifscParams: ifscParams,index:index })
    }

    checkContains = (obj) => {
        if (_.isEqual(obj.ifsc, this.state.ifscParams))
        {
            return true;
        }
        return false;
    }
    

    favourite = (event) => {

        let data = JSON.parse(localStorage.getItem('cacheBankData'));

        
        let currData = data[this.state.index ] ;
        
        if('favourite' in currData)
        {
            let fav = currData['favourite'] ;
            fav = !fav ;
            currData['favourite'] = fav ;

        }
        else{
            currData['favourite'] = true ; 
        }
        
        data[this.state.index] = currData ;

        localStorage.setItem("cacheBankData", JSON.stringify(data));

        data = JSON.parse(localStorage.getItem('cacheBankData'));
        
    }
    render() {
        let displayBank = null ;
        if (this.state.ifscParams !== null) {
            displayBank = this.props.bankData.filter(obj =>
                this.checkContains(obj)
            )
            
        }

        return (
            <div>
                {displayBank ? <div>
                    <div className={styles.cardTextMedium}>Bank Name : {displayBank[0].bank_name}</div>
                    <div className={styles.cardTextMedium}>IFSC : {displayBank[0].ifsc}</div>
                    <div className={styles.cardTextMedium}>Branch : {displayBank[0].branch}</div>
                    <div className={styles.cardTextMedium}>Bank ID : {displayBank[0].bank_id}</div>
                    <div className={styles.cardTextMedium}>Address : {displayBank[0].address}</div>
                    <input onChange={(event)=>this.favourite(event)} type="checkbox" id="favourite" name="favourite" value="favourite"/>
                    <label for="favourite"> favourite</label>
                </div> : null}
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