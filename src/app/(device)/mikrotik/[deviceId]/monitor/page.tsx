export default function Monitor({ params }: { params: { deviceId: string } }) {
    return (
        <h1>{params.deviceId}</h1>
    )
}