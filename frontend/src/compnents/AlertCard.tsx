interface AlertDataBackend {
	UserId: number;
	alertTemp: number;
	city: string;
	createdAt: string;
	greater: boolean;
	id: number;
	message: string;
	updatedAt: string;
}
interface AlertDataProps {
	data: AlertDataBackend;
}
export default function AlertCard(props: AlertDataProps) {
	return <div style={{margin:".5rem"}}>
        <h4>{props.data.city}</h4>
        <h4>{props.data.message}</h4>
        <h4>{props.data.alertTemp}</h4>
    </div>;
}
