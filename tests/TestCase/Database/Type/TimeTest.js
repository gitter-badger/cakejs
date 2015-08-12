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
 * @author      Tiinusen <tiinusen@cakejs.net>
 * @author      Addelajnen <addelajnen@cakejs.net>
 */

//Uses
import { TestCase } from 'Cake/TestSuite/TestCase';
import { TableRegistry } from 'Cake/ORM/TableRegistry';
import { Type } from 'Cake/Database/Type';


export class TimeTest extends TestCase
{
	setUp()
	{
		this.Time = Type.build('time');
		this.now = new Date(new Date().format('yyyy-mm-dd')+' 15:00:00');
	}
	
	testNode()
	{
		this.assertEquals(this.now,this.Time.toNode('15:00:00'));
		this.assertEquals(null,this.Time.toNode(null));
	}
	
	testDatabase()
	{
		this.assertEquals('15:00:00',this.Time.toDatabase('15:00:00'));
		this.assertEquals(null,this.Time.toDatabase('00:00:00'));
		this.assertEquals(null,this.Time.toDatabase(null));
	}
	
	testMarshal()
	{
		this.assertEquals(this.now,this.Time.marshal(this.now));
		this.assertEquals(this.now,this.Time.marshal('15:00:00'));
		this.assertEquals(this.now,this.Time.marshal(this.now.getTime()));
		this.assertEquals(null,this.Time.marshal(null));
		this.assertEquals(null,this.Time.marshal(false));
		this.assertEquals(null,this.Time.marshal(true));
		this.assertEquals(null,this.Time.marshal('00:00:00'));
	}
}