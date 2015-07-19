/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import {Command} from '../Command';

export class TestCommand extends Command
{
    constructor()
    {
        super();
    }
    
    configure(engine)
    {
        this.setName('test');
        this.setDescription('Run tests.');
        this.setManual('Run Mocha tests...')
        this.setParameter({
           'name': 'timeout',
           'optional': true,
           'description': 'This parameter defines number of seconds before the tests will timeout.'
        });
        this.setParameter({
           'name': 'name',
           'optional': false,
           'description': 'This parameter defines what test to run.'
        });
        this.setParameter({
           'name': 'bail',
           'optional': false,
           'description': 'Bail test?'
        });
        this.setParameter({
           'name': 'data',
           'optional': true,
           'description': 'Data stuff.'
        });
    }
    
    execute(engine, parameters)
    {        
        return true;
    }
}