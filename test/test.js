var chai = require('chai'),
    julia = require('..'),
    expect = chai.expect;

function eval(julia,x)
{
   var res;

   julia.eval('' + x,function(juliaResult)
   {
      res = juliaResult; 
   });

   return res;
}

function execIdentity(julia,x)
{
   var res;

   julia.exec('identity',x,function(juliaResult)
   {
      res = juliaResult; 
   });

   return res;
}

function execInclude(julia,filename)
{
   var res;

   julia.exec('include',filename,function(juliaResult)
   {
      res = juliaResult;
   });

   return res;
}

function exec1(julia)
{
   var args = [];
   var res;

   for(var i = 1;i < arguments.length;i++) args.push(arguments[i]);
   args.push(function(juliaResult) { res = juliaResult; });

   julia.exec.apply(null,args);

   return res;
}

function verifyIdentity(X,expectedLength)
{
   var len = X.length;
   var passed = X.length == expectedLength;

   if(!passed) return false;

   for(var i = 0;i < X.length;i++)
   {
      if(X[i].length != X.length) 
      {
         passed = false;
         break;
      }

      for(j = 0;j < len;j++)
      {
         if(i == j && X[i][j] != 1)
         {
            passed = false;
            break;
         }
         if(i != j && X[i][j] != 0)
         {
            passd = false;
            break;
         }
      }
   }

   return passed;
}

describe('Regression Tests',function()
{
   it('start() must return "Julia Started"',function()
   {
      expect(julia.start()).to.equal('Julia Started');
   });

   it('eval Null return',function()
   {
      expect(eval(julia,"()")).to.equal(null);
   });

   it('eval Boolean return',function()
   {
      expect(eval(julia,true)).to.equal(true);
   });

   it('eval Integer return',function()
   {
      expect(eval(julia,0)).to.equal(0);
   });

   it('eval max 32 bit Integer (4294967296)',function()
   {
      expect(eval(julia,4294967296)).to.equal(4294967296);
   });

   it('eval max JavaScript Integer (9007199254740992)',function()
   {
      expect(eval(julia,9007199254740992)).to.equal(9007199254740992);
   });

   it('eval primitive Float return',function()
   {
      expect(eval(julia,1.0)).to.equal(1.0);
   });

   it('eval max JavaScript Float (' + Number.MAX_VALUE + ')',function()
   {
      expect(eval(julia,Number.MAX_VALUE)).to.equal(Number.MAX_VALUE);
   });

   it('exec identity Boolean',function()
   {
      expect(execIdentity(julia,true)).to.equal(true);
   });

   it('exec identity Integer',function()
   {
      expect(execIdentity(julia,1)).to.equal(1);
   });

   it('exec identity Float',function()
   {
      expect(execIdentity(julia,0.1)).to.equal(0.1);
   });

   it('exec identity String',function()
   {
      expect(execIdentity(julia,'x')).to.equal('x');
   });

   it('eval include',function()
   {
      expect(eval(julia,'Core.include("test/inc1.jl")')).to.equal(true);
   });

   it('exec include',function()
   {
      expect(execInclude(julia,'test/inc2.jl')).to.equal(true);
   });

   it('user defined functions via exec',function()
   {
      expect(exec1(julia,'f',100)).to.equal(exec1(julia,'g',100));
   });

   it('macros via eval',function()
   {
      expect(eval(julia,'@sprintf("x")')).to.equal('x');
   });

   it('arrays via eval',function()
   {
      expect(verifyIdentity(eval(julia,'eye(1000)'),1000)).to.equal(true);
   });

   it('arrays via exec',function()
   {
      expect(verifyIdentity(exec1(julia,'eye',1000),1000)).to.equal(true);
   });
});
