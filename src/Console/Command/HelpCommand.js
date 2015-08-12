/**
 * Copyright (c) 2015 Tiinusen
 * 
 * Many thanks to Cake Software Foundation, Inc. (http://cakefoundation.org)
 * This was inspired by http://cakephp.org CakePHP(tm) Project
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) 2015 Tiinusen
 * @link        https://github.com/cakejs/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 * @author      addelajnen
 */

import {Command} from '../Command';
import {Option} from '../Option';

/**
 * The help command in the console.
 * 
 * @class
 */
export class HelpCommand extends Command
{    
    /**
     * Constructor.
     * 
     * @constructor
     */
    constructor()
    {
        super();
    }
    
    /**
     * Configure this command.
     * 
     * @return {void}
     */
    configure()
    {
        this.setName('help');
        this.setShortDescription('Help on how to use the console.')
        this.setLongDescription(
            'This command is used to list all commands and to get ' + 
            'detailed help for a specific command.'
        );

        this.addOption(new Option(
                'command', 
                Option.VALUE, 
                false, 
                'Show detailed help for a command.'
        ));

        return true;
    }
      
    /**
     * Execute the command.
     * 
     * @return {void}
     */
    execute()
    {
        let command = this.getParsedOption('command');
        if (command !== null) {
            this.printDetailedHelp(command);
        } else {
            this.printGenericHelp();
        }
    }

    /**
     * Prints generic help on how to use the console and lists the commands.
     */
    printGenericHelp()
    {
        this.out('<HEADER>Commands:<RESET>');
        this.out('');
        
        let commands = this.getConsole().getCommands();
        for (let i = 0; i < commands.length; i++) {
            let shortDescription = commands[i].getShortDescription();
            if (!shortDescription) {
                shortDescription = 'No description available.';
            }
            this.out('<COMMAND>' + commands[i].getName() + '<RESET> - <MESSAGE>' + shortDescription + '<RESET>');
        }
        
        this.out('');
        this.out('For detailed help, type: <COMMAND>' + this.getName() + '<RESET> [command]');
        this.out('');
    }    
    
    /**
     * Prints detailed help for a command.
     * 
     * @param {string} name The command name.
     */
    printDetailedHelp(name)
    {
        let command = this.getConsole().getCommandByName(name);
        if (command === null) {
            this.out('<ERROR>Unknown command:<RESET> <COMMAND>' + name + '<RESET>');
            return;
        }
        
        this.out('Detailed help for <COMMAND>' + command.getName() + '<RESET>');
        this.out('');
        let longDescription = command.getLongDescription();
        if (longDescription)
            this.out(longDescription);
        else
            this.out('No description available.');
        
        this.out('');
        this.out('<HEADER>Usage:<RESET>');
        this.out('');
        this.printUsage(name);
        this.out('');
    }
	
	/**
	 * Print option usage.
	 * 
	 * @param {Option} option The option to print.
	 */
	printOptionUsage(option, steps)
	{
		let usage = '';
		usage = option.getName() + ' - ' + option.getDescription();
		for (let i = 0; i < option.getSubOptionCount(); i++) {
			let subOption = option.getSubOption(i);
			
			this.printOptionUsage(subOption);
		}
	}
	
    /**
     * Prints the usage for a command.
     * 
     * @param {string} name The command.
     */
    printUsage(name)
    {        
        let command = this.getConsole().getCommandByName(name);
        if (!command) {
            return null;
        }
        
        let usage = '<COMMAND>' + command.getName() + '<RESET> ';
        for (let i = 0; i < command.getOptionCount(); i++) {
            let option = command.getOption(i);
            
            usage = this._buildUsageString(usage, option) + ' ';
        }
        
        this.out(usage);
        
        for (let i = 0; i < command.getOptionCount(); i++) {
            let option = command.getOption(i);
            
            this.printOptionUsage(option, 0);
        }
        
    }
    
    /**
     * Build a usage string for the option.
     * 
     * @param {string} usage The usage string.
     * @param {Option} option The option.
     * 
     * @return {string} The usage string.
     */
    _buildUsageString(usage, option)
    {
       
        let start = '';
        let end = '';
        
        if (option.isRequired()) {
            start = '<';
            end = '>';
        } else {
            start = '[';
            end = ']';
        }
        
        usage += start + option.getName();
        
        if (option.getSubOptionCount() > 0) {
            usage += ' ';
            for (let i = 0; i < option.getSubOptionCount(); i++) {
                usage = this._buildUsageString(usage, option.getSubOption(i));
            }
        }
        
        usage += end;
        
        return usage;        
    }
}

