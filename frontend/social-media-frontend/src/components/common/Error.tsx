const Error = ({ children, ...props }: any) => {
    return (
        <div
            style={{ color: '#f23838', textAlign: 'center', margin: '0.5rem 0' }}
            {...props}
        >
            {children}
        </div>
    )
}

export default Error