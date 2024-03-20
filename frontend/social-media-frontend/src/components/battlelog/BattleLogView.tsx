import React, { useState } from 'react'

const BattleLogView = ({ battlelog }: any) => {
    const battlelogs = battlelog.map((battle: any, index: number) => (
        <div key={index}>battle</div>
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