<?php 
if (!empty($_POST)){

// Save form in Drive
$Url = "https://docs.google.com/forms/d/e/1FAIpQLSeRBsrT1crinnp9IY_kt_QmM-kBLvgsSIp9DGiSK_-WFZzCiA/formResponse";
      $fullname = "entry.1547516177=" . replaceCharacter($_POST['nombre']);
      $correo = "entry.1494230708=" . replaceCharacter($_POST['email']);
      $telefono = "entry.682733425=" . $_POST['telefono'];
      $grado="entry.1295233448=".replaceCharacter($_POST['mensaje']);
      $strRequest = "$fullname&$correo&$telefono&$grado";
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $Url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $strRequest);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

      $result = curl_exec($ch);

      curl_close($ch);

       
}else{
  echo "-";
}
function replaceCharacter($string)
{
        $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ
ßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŔŕ';
        $modificadas = 'AAaaaaacEEeeIIiidNOOooooUUuuy
bsaaaaaaaceeeeiiiidnoooooouuuyybyRr';
        $string = utf8_decode($string);
        $string = strtr($string, utf8_decode($originales), $modificadas);
        return utf8_encode($string);
    }

 ?>