import { Route, Switch } from 'react-router-dom';
import Doc from '@/pages/Doc/index.js';
import Debug from '@/pages/Debug/index.js';
import Tools from '@/pages/Tools/index.js';

const router = () => {
    return (
        <Switch>
            <Route exact path='/' component={Debug}></Route>
            <Route path='/doc' component={Doc}></Route>
            <Route path='/debug' component={Debug}></Route>
            <Route path='/tools' component={Tools}></Route>
        </Switch>
    )
}

export default router;