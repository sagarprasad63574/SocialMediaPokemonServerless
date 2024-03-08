import React from 'react'

function TeamsForm(props: any) {

    async function viewTeams() {
        let result = await props.userTeams();
        console.log(result.success);
    }

    viewTeams();
  return (
    <div>TeamsForm</div>
  )
}

export default TeamsForm