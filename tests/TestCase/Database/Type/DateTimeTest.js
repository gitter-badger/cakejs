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
 * @link        https://github.com/cakejsframework/cakejs
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 * @author      Tiinusen <tiinusen@cakejs.net>
 * @author      Addelajnen <addelajnen@cakejs.net>
 */

//Uses
import { TestCase } from 'Cake/TestSuite/TestCase';
import { TableRegistry } from 'Cake/ORM/TableRegistry';
import { Type } from 'Cake/Database/Type';


export class DateTimeTest extends TestCase
{
	setUp()
	{
		this.DateTime = Type.build('datetime');
	}
	
	testNode()
	{
		this.assertEquals(new Date('2012-04-18 15:00:00'),this.DateTime.toNode('2012-04-18 15:00:00'));
		this.assertEquals(null,this.DateTime.toNode(null));
	}
	
	testDatabase()
	{
		this.assertEquals('2012-04-18 15:00:00',this.DateTime.toDatabase('2012-04-18 15:00:00'));
		this.assertEquals(null,this.DateTime.toDatabase('0000-00-00 00:00:00'));
		this.assertEquals(null,this.DateTime.toDatabase(null));
	}
	
	testMarshal()
	{
		this.assertEquals(new Date('2012-04-18 15:00:00'),this.DateTime.marshal(new Date('2012-04-18 15:00:00')));
		this.assertEquals(new Date('2012-04-18 15:00:00'),this.DateTime.marshal('2012-04-18 15:00:00'));
		this.assertEquals(new Date('2012-04-18 15:00:00'),this.DateTime.marshal(new Date('2012-04-18 15:00:00').getTime()));
		this.assertEquals(null,this.DateTime.marshal(null));
		this.assertEquals(null,this.DateTime.marshal(false));
		this.assertEquals(null,this.DateTime.marshal(true));
		this.assertEquals(null,this.DateTime.marshal('0000-00-00 00:00:00'));
	}
}