import React,{Component} from 'react';
import Tilt from 'react-parallax-tilt';
import icon from './Vector Face By Antonis Makriyannis GR.png';
import './Logo.css'

class Logo extends Component {
    render(){
        return (
            <div className='logo'>
                <div className='ma4 mb0 mt0 logo-icon'>
                    <Tilt className='tilt'>
                        <div className='tilt-inner br2 shadow-2'>
                            <div className='line br2 shadow-3'/>
                            <img className='br1 shadow-1' src={icon} alt='logo'/>
                        </div>
                    </Tilt>
                </div>
                <div className='credits ml4 mt1'>
                    <div className='w-50'>Icon by</div>
                    <a className='w-50' href='https://thenounproject.com/AntonisMakriyannis/'>{'Antonis Makriyannis'}</a>
                </div>
            </div>
        );
    }
}

export default Logo;