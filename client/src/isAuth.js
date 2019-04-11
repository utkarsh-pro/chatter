export default async () => {
    const res = await fetch('/checkToken', {
        headers: {
            Authorization: JSON.parse(localStorage.getItem('jwt'))
        }
    });
    return res;
}
