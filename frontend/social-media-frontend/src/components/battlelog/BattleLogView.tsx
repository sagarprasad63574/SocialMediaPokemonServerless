import React, { useState } from 'react'

const BattleLogView = ({ battlelog }: any) => {
    const battlelogs = battlelog.map((battle: any, index: number) => (
        <div key={index}>
            <div>
                <h4>Summary: {battlelog.summary}</h4>
            </div>
            <div>
                <h4>Full List</h4>
                <ul>
                    {battle.details.map((detail: any, dIndex: number) => (
                        <li key="dIndex">{detail}</li>
                    ))}
                </ul>
            </div>
        </div>

        )
    )
    return (
        <div>
            {battlelog.length ? (
                <div>
                    <h1>BattleLog</h1>
                    {battlelogs}
                </div>
            ) : (
                <div>No Battle Log</div>
            )
            }
        </div>
    )
}

export default BattleLogView