import React, { useState } from 'react'
import Carousel from 'react-bootstrap/esm/Carousel'

const BattleLogView = ({ battlelog }: any) => {
    const battlelogs = battlelog.map((battle: any, index: number) => (
        <Carousel.Item key={index}>
            <div style={{ padding: "50px 150px 50px 150px" }}>
                {battle.details.map((detail: any, detailIndex: number) => {
                    return <li key={detailIndex}>{detail}</li>
                })}
            </div>
        </Carousel.Item>
    )
    )
    return (
        <div>
            <hr />
            {
                battlelog.length ?
                    <div className='mt-4'>
                        <h3>BattleLog</h3>
                        <Carousel data-bs-theme="dark">
                            {battlelogs}
                        </Carousel>
                    </div> :
                    <div>No Battle Log</div>
            }
        </div>
    )
}

export default BattleLogView