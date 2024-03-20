const Error = ({ children, ...props }: any) => {
    return (
        <div
            style={{ color: '#f23838', textAlign: 'center', margin: '0.5rem 0' }}
            {...props} 
        >
            {children.length > 0 ? children.map((child: any, index: any) => <div key={index}>{child}</div>): children}
        </div>
    )
}

export default Error