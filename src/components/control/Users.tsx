import { Database_User } from '@/interface';
import style from './Users.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/AddOutlined';
import BorderOuterIcon from '@mui/icons-material/BorderOuterOutlined';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showToast } from '@/store/toastSlice';

function UserItem({
    id,
    name,
    username,
    access
}: {
    id: Database_User['id'],
    name: Database_User['name'],
    username: Database_User['username'],
    access: Database_User['access']
}) {
    return (
        <tr>
            <td>1</td>
            <td>{name}</td>
            <td>{username}</td>
            <td>{access}</td>
            <td>
                <DeleteIcon />
            </td>
        </tr>
    );
}

function AddDeviceView({ refresh, setDeviceListView }: { refresh: () => void, setDeviceListView: (a: boolean) => void }) {
    const dispatch = useDispatch();
    const name = useRef<HTMLInputElement>(null);
    const hostname = useRef<HTMLInputElement>(null);
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const port = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);

    const submitData = () => {
        axios.post('/api/admin/user', {
            name: 'h',
            username: 'h',
            password: 'h',
            access: 'full',
            disabled: false
        }).then(response => {
            if (response.data.success) {
                refresh();
                return setDeviceListView(true);
            }

            dispatch(showToast({
                text: response.data.payload.message[0],
                duration: 6000
            }));
        })
    }

    return (
        <div className={style.addDeviceContainer}>
            <div className={style.left}>
                <div className={style.field}>
                    <label className={style.label}>Name</label>
                    <input ref={name} className={style.form} type="text" placeholder="Smile Simi" />
                </div>
                <div className={style.field}>
                    <label className={style.label}>Username</label>
                    <input ref={hostname} className={style.form} type="text" placeholder="simi" />
                </div>
                <div className={style.field}>
                    <label className={style.label}>Password</label>
                    <input ref={username} className={style.form} type="password" />
                </div>
                <div className={style.field}>
                    <label className={style.label}>Confirm Password</label>
                    <input ref={password} className={style.form} type="password" />
                </div>
                <div className={style.field}>
                    <label className={style.label}>Status</label>
                    <select>
                        <option>full</option>
                        <option>semi-full</option>
                        <option>readonly</option>
                    </select>
                </div>
            </div>
            <div className={style.right}>
                <div className={style.field}>
                    <label className={style.label}>Description</label>
                    <textarea ref={description} className={style.textarea}></textarea>
                </div>
            </div>
            <div className={style.submitButton} onClick={submitData}>
                Submit
            </div>
        </div>
    );
}

export default function Users() {
    const [userListView, setUserListView] = useState(true);
    const [userList, setUserList] = useState<Database_User[]>([]);

    const requestUserList = () => {
        axios.get('/api/admin/user').then(response => {
            if (!response.data.success) {
                return;
            }

            setUserList(response.data.payload.data);
        });
    };

    useEffect(() => {
        requestUserList();
    }, [userListView]);

    return (
        <div className={style.container}>
            <div className={style.toolbar}>
                <div className={style.item} onClick={() => setUserListView(!userListView)}>
                    {userListView ? <><AddIcon className={style.icon} /> Add user</> : <><BorderOuterIcon className={style.icon} /> User list</>}
                </div>
            </div>
            {
                userListView ?
                    <div className={style.userTableContainer}>
                        <table className={style.userTable}>
                            <thead>
                                <tr>
                                    <td>No#</td>
                                    <td>Name</td>
                                    <td>Username</td>
                                    <td>Access</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userList.map((user) => {
                                        return <UserItem key={user.id} id={user.id} name={user.name} username={user.username} access={user.access} />;
                                    })
                                }
                            </tbody>
                        </table>
                    </div> : <AddDeviceView refresh={requestUserList} setDeviceListView={setUserListView} />
            }
        </div>
    );
}