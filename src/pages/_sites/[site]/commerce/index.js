/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function index(props) {
    return (
        <div>
            Enter
        </div>
    );
}

export async function getServerSideProps(ctx) {


    return {
        props: {
            data: null
        }
    }
}
