import Head from 'next/head';
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import { Fragment } from 'react';

function HomePage(props) {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta
                    name='description'
                    content='Browse a huge list of highly active React meetups!'
                />
            </Head>
            <MeetupList meetups={props.meetups} />;
        </Fragment>);
};
// in page works only, wait for load data, after render... 
//pre rendered data too..
// server codes can run here .../ when building --> execute
// Adatbazis bovitesenel nem frissul, mivel buildelesnel hajtodik vegre a kód

export async function getStaticProps() {
    const client = await MongoClient.connect(
        'mongodb+srv://Tibi:Tibiking92@cluster0.xjruu.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    client.close();

    return {
        props: {
            meetups: meetups.map((meetup) => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),
            })),
        },
        //refresh, code generated in server every 10 sec
        revalidate: 1
    };
}


//after deployment will run, itt will run on the server, never by client
//Minden változásra frissül, dinamikus
/*
export async function getServerSideProps(context) {
    const req = context.req;
    const res = context.res;

    return {
        props: {
            meetups: DUMMY_MEETUPS       
        }
    };
}
*/

export default HomePage;