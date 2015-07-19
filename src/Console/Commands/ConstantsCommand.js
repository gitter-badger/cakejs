/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import {Command} from '../Command';

export class ConstantsCommand extends Command
{
    constructor()
    {
        super();
    }
    
    configure(engine)
    {
        this.setName('constants');
        this.setDescription('Display global constants.');
        this.setManual('TODO: Detailed help.')
        this.setParameter({
           'name': 'bootstrap',
           'optional': true,
           'description': 'Override default bootstrap.',
           'auto': true
        });
    }
    
    execute(engine, parameters)
    {
        let bootstrapFile = '';
        if (parameters.bootstrap !== null) {
            bootstrapFile = require('path').resolve(process.cwd(), parameters.bootstrap);
        } else {
            bootstrapFile = require('path').resolve(process.cwd(), 'bootstrap.js');
        }
        
        if (require('fs').existsSync(bootstrapFile)) {
            require(bootstrapFile);
            
            engine.out('The constant "%EM%APP%RESET%" is set to "%EM%' + APP + '%RESET%".');
            engine.out('The constant "%EM%APP_DIR%RESET%" is set to "%EM%' + APP_DIR + '%RESET%".');
            engine.out('The constant "%EM%CACHE%RESET%" is set to "%EM%' + CACHE + '%RESET%".');
            engine.out('The constant "%EM%CAKE%RESET%" is set to "%EM%' + CAKE + '%RESET%".');
            engine.out('The constant "%EM%CAKE_CORE_INCLUDE_PATH%RESET%" is set to "%EM%' + CAKE_CORE_INCLUDE_PATH + '%RESET%".');
            engine.out('The constant "%EM%CORE_PATH%RESET%" is set to "%EM%' + CORE_PATH + '%RESET%".');
            engine.out('The constant "%EM%CAKE_VERSION%RESET%" is set to "%EM%' + CAKE_VERSION + '%RESET%".');
            engine.out('The constant "%EM%DS%RESET%" is set to "%EM%' + DS + '%RESET%".');
            engine.out('The constant "%EM%LOGS%RESET%" is set to "%EM%' + LOGS + '%RESET%".');
            engine.out('The constant "%EM%ROOT%RESET%" is set to "%EM%' + ROOT + '%RESET%".');
            engine.out('The constant "%EM%TESTS%RESET%" is set to "%EM%' + TESTS + '%RESET%".');
            engine.out('The constant "%EM%TMP%RESET%" is set to "%EM%' + TMP + '%RESET%".');
            engine.out('The constant "%EM%WWW_ROOT%RESET%" is set to "%EM%' + WWW_ROOT + '%RESET%".');
        } else {
            engine.out('No such file "%ERROR%' + bootstrapFile + '%RESET%".');
        }
        
        return true;
    }
}