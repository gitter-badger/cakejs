/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Types
import {Shell} from '../../Shell'

export class TestingShell extends Shell
{    
    constructor()
    {
        super();        
    }
    
    async main(argv)
    {
        await this.send(argv);
        await this.read();
    }
    
    onData(data)
    {
        console.log('Data received from server:');
        console.log(data);
    }
}

